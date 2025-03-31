import { StatusCodes } from "http-status-codes";

/**  A custom Error class for known errors */
export class AppError extends Error {
  statusCode: number;
  constructor(
    message: string,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}
