import axios, { AxiosRequestConfig } from "axios";

import { apiConfig } from "../utils/api-config.utils";

// Create Axios instance
const api = axios.create({
  baseURL: apiConfig.development.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Generic API request function
const coreService = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.get<T>(url, config);
    return response.data;
  },

  post: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await api.post<T>(url, data, config);
    return response.data;
  },

  put: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await api.put<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.delete<T>(url, config);
    return response.data;
  },
};

export default coreService;
