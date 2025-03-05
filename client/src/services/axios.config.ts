import axios from "axios";

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
    const userData = localStorage.getItem("user");
    const token = userData ? JSON.parse(userData)?.token : null;

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
  console.log("Setting up Axios Interceptors...");

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
      console.log("API Response Received, Hiding Loader...");
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
