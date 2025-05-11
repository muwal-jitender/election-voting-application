import axios from "axios";
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

// ✅ Setup Axios interceptors to handle loading and auth errors globally
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

      // ⛔ 1. Unauthorized: redirect to login
      if (error.status === 401) {
        const errorType = error?.response?.data?.errorType;
        if (errorType === "ACCESS_TOKEN_EXPIRED") {
          // ✅ 2. Try to refresh token
          try {
            await voterService.refreshToken();
            // ✅ 3. Retry the original request
            return api(error.config);
          } catch (refreshErr) {
            // ✅ 4. Refresh token failed, logout user
            navigate("/");
            return Promise.reject(refreshErr);
          }
        }
        if (errorType === "REFRESH_TOKEN_INVALID") {
          // ✅ 5. Don't attempt refresh, just logout
          navigate("/");
        }
      }
      // ⛔ Forbidden: Reset admin privileges and redirect
      if (error.status === 403 && user?.isAdmin) {
        setUser && setUser({ ...user, isAdmin: false });
        navigate("/results");
      }

      return Promise.reject(error);
    },
  );
};

export default api;
