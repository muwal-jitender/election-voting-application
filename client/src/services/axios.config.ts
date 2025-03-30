import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IUserResponse } from "types";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL?.trim();

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ✅ Function to Set Up Axios Interceptors (Run Once)
export const setupAxiosInterceptors = (
  setLoading: (loading: boolean) => void,
  navigate: ReturnType<typeof useNavigate>,
  user: IUserResponse | null,
  setUser: (user: IUserResponse | null) => void,
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

      // ✅ Redirect user to Login page if unauthorized
      if (error.status === 401) {
        navigate("/");
      }
      if (error.status === 403 && user?.isAdmin) {
        setUser({ ...user, isAdmin: false });
        navigate("/results");
      }

      return Promise.reject(error);
    },
  );
};

export default api;
