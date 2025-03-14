import { NextFunction, Request, Response } from "express";
import { ValidationError, validate } from "class-validator";

import { BadRequestError } from "../utils/exceptions.utils";
import { StatusCodes } from "http-status-codes";
import { plainToInstance } from "class-transformer";

/**
 * Middleware to validate request body against a DTO class
 * @param dtoClass - The DTO class to validate against
 */
export const validateRequest = <T extends object>(dtoClass: new () => T) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const dtoInstance = plainToInstance(dtoClass, req.body);
    const errors: ValidationError[] = await validate(dtoInstance);

    if (errors.length > 0) {
      // ✅ Convert nested errors into a flat array of strings
      const errorMessages: string[] = errors.flatMap((err) =>
        Object.values(err.constraints || {})
      );
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Bad Request",
        errorMessages,
      });
    }

    next(); // ✅ Pass control to next middleware
  };
};
