import { AppError } from "./exceptions.utils";
import { StatusCodes } from "http-status-codes";
import { UploadedFile } from "express-fileupload";
import path from "path";

/** ✅ Allowed image file extensions */
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export const UPLOADS_DIR = path.join(__dirname, "../../uploads"); // ✅ Centralized uploads directory

/** ✅ Max file size (10MB) */
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

/** ✅ Validate file size */
export const validateFileSize = (size: number) => {
  if (size > MAX_IMAGE_SIZE)
    throw new AppError(
      "File too large. Maximum allowed size is 10MB.",
      StatusCodes.BAD_REQUEST
    );
};

/** ✅ Validate image type */
export const validateImageFile = (file: UploadedFile, throwError = true) => {
  if (!throwError) return;
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    throw new AppError(
      `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(", ")}`,
      StatusCodes.BAD_REQUEST
    );
  }
};

/** ✅ Extract filename from URL */
export const getFilenameFromUrl = (url: string): string => {
  const parsedUrl = new URL(url);
  return parsedUrl.pathname.substring(parsedUrl.pathname.lastIndexOf("/") + 1);
};
