import { UPLOADS_DIR } from "./config.utils";
import { UploadedFile } from "express-fileupload";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

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
