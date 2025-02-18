
interface CustomError extends Error {
  code?: number;
}

class HttpError extends Error {
  code: number;

  constructor(message: string, errorCode: number) {
    super(message);
    this.code = errorCode;
  }
}

export {CustomError, HttpError}