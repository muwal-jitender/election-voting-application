import { BadRequestError } from "./exceptions.utils";
import mongoose from "mongoose";

/**
 * Validates if a given ID is a valid MongoDB ObjectId
 * @param id - The ID to validate
 * @param fieldName - (Optional) Field name for better error messages
 */
export const validateMongoId = (id: string, fieldName = "ID") => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError(`Invalid or missing ${fieldName}`);
  }
};
