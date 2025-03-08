import { IApiError, IApiResponse } from "../types/ResponseModel";

import { AxiosRequestConfig } from "axios";
import api from "./axios.config";

export const apiRequest = async <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  data?: unknown,
  config: AxiosRequestConfig = {},
): Promise<IApiResponse<T>> => {
  try {
    const result = await api({
      url,
      method,
      data,
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
