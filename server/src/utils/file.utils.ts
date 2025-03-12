import { FileArray, UploadedFile } from "express-fileupload";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../config/cloudinary.config";
import {
  getFilenameFromUrl,
  validateFileSize,
  validateImageFile,
} from "./file-validate.utils";

import { BadRequestError } from "./exceptions.utils";
import { UPLOADS_DIR } from "./file-validate.utils";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

/** ✅ Upload file to Local Storage */
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

/** ✅ Upload File to Local Storage & Cloudinary */
export const uploadFile = async (
  files: FileArray | null | undefined,
  propertyName: "thumbnail" | "image",
  oldImage?: string // ✅ Use old image for updates
) => {
  // ✅ If no image is submitted and we have old image too, means an Update case
  if (!files?.[propertyName] && oldImage) {
    // ✅ Update Case
    return oldImage; // Return old image url to be used
  } else if (!files?.[propertyName]) {
    // ✅ Insert Case
    throw new BadRequestError(`${propertyName} is missing`);
  }

  const file = files[propertyName];
  if (Array.isArray(file)) {
    throw new BadRequestError("Multiple file uploads are not allowed.");
  }

  validateImageFile(file);
  validateFileSize(file.size);

  // ✅ Upload to local storage
  const localFilePath = await uploadToLocal(file);
  // ✅ Upload to Cloudinary
  const cloudinaryUrl = await uploadToCloudinary(localFilePath);

  if (!cloudinaryUrl) throw new Error("File upload failed.");
  return cloudinaryUrl;
};

/** ✅ Delete file from Local Storage & Cloudinary */
export const deleteFile = async (fileUrl: string) => {
  if (!fileUrl) return;

  // ✅ Delete from Cloudinary
  await deleteFromCloudinary(fileUrl);
  // ✅ Delete from local storage
  deleteFromLocal(fileUrl);
};
