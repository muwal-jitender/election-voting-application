import axios from "axios";
import { getToken } from "../utils/auth.utils";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL?.trim();

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// 🔥 Add an interceptor to inject the token automatically
api.interceptors.request.use(
  (config) => {
    // 🔥 Get the token from localStorage
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ✅ Function to Set Up Axios Interceptors (Run Once)
export const setupAxiosInterceptors = (
  setLoading: (loading: boolean) => void,
) => {
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

  api.interceptors.response.use(
    (response) => {
      setLoading(false);
      return response;
    },
    (error) => {
      setLoading(false);
      return Promise.reject(error);
    },
  );
};

export default api;
