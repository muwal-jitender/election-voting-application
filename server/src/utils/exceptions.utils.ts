import { StatusCodes } from "http-status-codes";

export class BadRequestError extends Error {
  statusCode: number;
  details: any;

  constructor(message: string, details: any = null) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.details = details;
  }
}
export class NotFoundError extends Error {
  statusCode: number;
  details: any;

  constructor(message: string, details: any = null) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.details = details;
  }
}
export class ConflictError extends Error {
  statusCode: number;
  details: any;

  constructor(message: string, details: any = null) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
    this.details = details;
  }
}
export class ForbiddenError extends Error {
  statusCode: number;
  details: any;

  constructor(message: string, details: any = null) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
    this.details = details;
  }
}
export class UnauthorizedError extends Error {
  statusCode: number;
  details: any;

  constructor(message: string, details: any = null) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.details = details;
  }
}
