export interface IApiResponse<T> {
  status: number;
  message: string;
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
