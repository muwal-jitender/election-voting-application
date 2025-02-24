export class BadRequestError extends Error {
  statusCode: number;
  details: any;

  constructor(message: string, details: any = null) {
    super(message);
    this.statusCode = 400;
    this.details = details;
  }
}
