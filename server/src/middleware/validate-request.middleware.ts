import { NextFunction, Request, Response } from "express";
import { ValidationError, validate } from "class-validator";

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
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.map((err) => err.constraints) });
      return; // ✅ Ensures no further execution
    }

    next(); // ✅ Pass control to next middleware
  };
};
