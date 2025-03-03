import axios, { AxiosRequestConfig } from "axios";
import { IApiError, IApiResponse } from "../types/ResponseModel";

import { apiConfig } from "../utils/api-config.utils";

export const apiRequest = async <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  data?: unknown,
  config: AxiosRequestConfig = {},
): Promise<IApiResponse<T>> => {
  try {
    const result = await axios({
      baseURL: apiConfig.development.API_BASE_URL,
      url,
      method,
      data,
      headers: { "Content-Type": "application/json" },
      ...config,
    });

    const response: IApiResponse<T> = {
      message: result.data.message,
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
