import { BadRequestError } from "./exceptions.utils";
import { UPLOADS_DIR } from "./config.utils";
import { UploadedFile } from "express-fileupload";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

/** ✅ Allowed image file extensions */
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

/** ✅ Max file size (10MB) */
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Upload file to a specified directory locally and returns its path.
 * @param file - The uploaded file object.
 * @param destinationFolder - The folder where the file should be stored.
 * @returns A Promise that resolves with the file path.
 */
export const uploadToLocal = (file: UploadedFile): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    validateFileSize(file.size);
    validateImageFile(file);
    const fileExt = path.extname(file.name);
    // ✅ Cloudinary converts the `.jpeg` to `.jpg` that is why it has also been converted here locally
    const fileName = `${path.basename(file.name, fileExt)}-${uuid()}${fileExt === ".jpeg" ? ".jpg" : fileExt}`;

    const destinationPath = path.join(UPLOADS_DIR, fileName); // ✅ Append filename to the destination

    file.mv(destinationPath, (err) => {
      if (err) reject(err);
      else resolve(destinationPath); // ✅ Return the full path of the saved file
    });
  });
};

/**
 *  ✅ Delete a file from local storage
 * @param fileUrl
 */
export const deleteFromLocal = (fileUrl: string) => {
  try {
    const filename = getFilenameFromUrl(fileUrl);
    const filePath = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted local file: ${filePath}`);
    }
  } catch (error) {
    console.error("❌ Failed to delete local file:", error);
  }
};

/**
 * Returns the file name from the URL
 * @param url
 * @returns
 */
export const getFilenameFromUrl = (url: string) => {
  const parsedUrl = new URL(url);
  const pathname = parsedUrl.pathname;
  return pathname.substring(pathname.lastIndexOf("/") + 1);
};

/** The file size should be less than 10MB */
const validateFileSize = (size: number) => {
  if (size > MAX_IMAGE_SIZE) {
    throw new BadRequestError("File too large. Maximum allowed size is 10MB.");
  }
};
const validateImageFile = (file: UploadedFile, throwError = true) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    throw new BadRequestError(
      `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(", ")}`
    );
  }
};
