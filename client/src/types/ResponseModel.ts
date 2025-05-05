export interface IApiResponse<T> {
  status: number;
  message: string;
  errorType?: "ACCESS_TOKEN_EXPIRED" | "REFRESH_TOKEN_INVALID";
  data?: T | null;
}

export interface IApiError {
  data?: {
    errorMessages: string[];
    message: string;
  };
}
export interface IErrorResponse {
  message: string;
  status: number;
  errorMessages?: string[];
}
