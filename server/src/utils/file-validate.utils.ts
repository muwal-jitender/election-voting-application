import { BadRequestError } from "./exceptions.utils";
import { UploadedFile } from "express-fileupload";

/** ✅ Allowed image file extensions */
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

/** ✅ Max file size (10MB) */
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

/** ✅ Validate file size */
export const validateFileSize = (size: number) => {
  if (size > MAX_IMAGE_SIZE)
    throw new BadRequestError("File too large. Maximum allowed size is 10MB.");
};

/** ✅ Validate image type */
export const validateImageFile = (file: UploadedFile, throwError = true) => {
  if (!throwError) return;
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    throw new BadRequestError(
      `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(", ")}`
    );
  }
};

/** ✅ Extract filename from URL */
export const getFilenameFromUrl = (url: string): string => {
  const parsedUrl = new URL(url);
  return parsedUrl.pathname.substring(parsedUrl.pathname.lastIndexOf("/") + 1);
};
