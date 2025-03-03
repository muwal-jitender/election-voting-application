import axios, { AxiosRequestConfig } from "axios";
import { IApiError, IApiResponse } from "../types/ResponseModel";

export const apiRequest = async <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  data?: unknown,
  config: AxiosRequestConfig = {},
): Promise<IApiResponse<T>> => {
  try {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL?.trim(); // Trim to remove unwanted spaces

    const result = await axios({
      baseURL: API_BASE_URL,
      url,
      method,
      data,
      headers: { "Content-Type": "application/json" },
      ...config,
    });

    const response: IApiResponse<T> = {
      message: result.data.message,
      data: result.data.data,
      status: result.data.status,
    }; // ✅ Ensures proper type safety
    return response;
  } catch (error: any) {
    const apiError = {
      message: (error.response as IApiError).data?.message,
      errorMessages: (error.response as IApiError).data?.errorMessages,
      status: error.response?.status,
    };

    throw apiError;
  }
};
