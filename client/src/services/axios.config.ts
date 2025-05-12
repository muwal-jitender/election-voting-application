import axios, { AxiosRequestConfig } from "axios";

import { useNavigate } from "react-router-dom";
import { IUserResponse } from "types";
import { voterService } from "./voter.service";

// 🌐 Base URL for API from environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL?.trim();

// 📦 Create Axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// 🔒 Track refresh status and subscribers
let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];
function onRefreshed() {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
}
interface ICustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean; // Custom property to track retry status
}
/**
 * Axios Interceptor Setup
 *
 * 🔐 Handles automatic JWT access token refresh and secure retry of failed requests.
 *
 * How it works:
 * - If a request fails with 401 (ACCESS_TOKEN_EXPIRED), the interceptor:
 *    1. Attempts to call `voterService.refreshToken()` to get a new access token via refresh-token cookie.
 *    2. Queues all other failed requests (`refreshSubscribers`) while refreshing is in progress.
 *    3. Once refreshed, replays all queued requests automatically.
 *    4. Prevents infinite retry loops using a custom `_retry` flag.
 * - If refresh fails (e.g., refresh-token is invalid or missing), it redirects the user to the login page.
 * - If a user is an admin but hits 403, their `isAdmin` role is downgraded and they are redirected to results.
 *
 * ⚠️ This setup avoids:
 * - Multiple concurrent refresh-token calls (via `isRefreshing` lock)
 * - Retrying the same request multiple times (via `_retry` flag)
 * - Losing failed requests mid-refresh (via subscriber queue)
 *
 * 🚀 To use this:
 * Call `setupAxiosInterceptors(setLoading, navigate, user, setUser)` inside your app/layout/init.
 */

export const setupAxiosInterceptors = (
  setLoading: (loading: boolean) => void,
  navigate: ReturnType<typeof useNavigate>,
  user: IUserResponse | null,
  setUser: ((user: IUserResponse | null) => void) | null,
) => {
  // 📤 Request Interceptor: Start loading before request
  api.interceptors.request.use(
    (config) => {
      setLoading(true);
      return config;
    },
    (error) => {
      setLoading(false);
      return Promise.reject(error);
    },
  );
  // 📥 Response Interceptor: Stop loading and handle errors globally
  api.interceptors.response.use(
    (response) => {
      setLoading(false);
      return response;
    },
    async (error) => {
      setLoading(false);

      const originalRequest = error.config as ICustomAxiosRequestConfig;
      const errorType = error?.response?.data?.errorType;
      const status = error.status;

      // ⛔ 1. Unauthorized: redirect to login, also 🛡️ Prevent infinite loop
      if (
        status === 401 &&
        errorType === "ACCESS_TOKEN_EXPIRED" &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true; // Mark request as retried
        if (isRefreshing) {
          // Queue pending requests while refreshing
          return new Promise((resolve) => {
            refreshSubscribers.push(() => resolve(api(originalRequest)));
          });
        }
        isRefreshing = true;
        // ✅ 2. Try to refresh token
        try {
          await voterService.refreshToken();
          isRefreshing = false;
          onRefreshed(); // Retry all subscribers
          // ✅ 3. Retry the original request
          return api(originalRequest);
        } catch (refreshErr) {
          isRefreshing = false;
          refreshSubscribers = []; // Clear queue
          // ✅ 4. Refresh token failed, logout user
          navigate("/");
          return Promise.reject(refreshErr);
        }
      }
      // 🔓 Refresh token invalid — logout
      if (status === 401 && errorType === "REFRESH_TOKEN_INVALID") {
        // ✅ 5. Don't attempt refresh, just logout
        navigate("/");
        return Promise.reject(error);
      }
      // ⛔ Forbidden: Reset admin privileges and redirect
      if (error.status === 403 && user?.isAdmin) {
        setUser && setUser({ ...user, isAdmin: false });
        navigate("/results");
        return Promise.reject(error);
      }

      return Promise.reject(error);
    },
  );
};

export default api;
