import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IUserResponse } from "types";

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
  setUser: (user: IUserResponse | null) => void,
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
    (error) => {
      setLoading(false);

      // ⛔ Unauthorized: redirect to login
      if (error.status === 401) {
        navigate("/");
      }
      // ⛔ Forbidden: Reset admin privileges and redirect
      if (error.status === 403 && user?.isAdmin) {
        setUser({ ...user, isAdmin: false });
        navigate("/results");
      }

      return Promise.reject(error);
    },
  );
};

export default api;
