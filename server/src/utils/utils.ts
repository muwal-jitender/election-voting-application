import { AppError } from "./exceptions.utils";
import { StatusCodes } from "http-status-codes";
import logger from "logger";
import mongoose from "mongoose";

/**
 * Validates if a given ID is a valid MongoDB ObjectId
 * @param id - The ID to validate
 * @param fieldName - (Optional) Field name for better error messages
 */
export const validateMongoId = (id: string, fieldName = "ID") => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    logger.warn(`⚠️ Invalid or missing ${fieldName} ➔ ${id}`);
    throw new AppError(
      `Invalid or missing ${fieldName}`,
      StatusCodes.BAD_REQUEST
    );
  }
};

export function transformMongoId<T extends { _id?: any; __v?: any }>(
  doc: T | null
): (Omit<T, "_id" | "__v"> & { id: string }) | null {
  if (!doc) return null;

  const { _id, __v, ...rest } = doc as any;
  return {
    ...rest,
    id: _id?.toString?.() ?? "",
  };
}

export function stripMongoMeta<T extends { _id?: any; __v?: any }>(
  doc: T | null
): Omit<T, "_id" | "__v"> | null {
  if (!doc) return null;

  const { _id, __v, ...rest } = doc;
  return rest;
}
