import { v2 as cloudinary } from "cloudinary";
import { env } from "../utils/env.config";
import fs from "fs"; // File system module

// ✅ Configure Cloudinary (Ensure it's set up in `env.config.ts`)
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a file to Cloudinary and returns the file URL.
 * @param filePath - Local path to the file
 * @param folder - Cloudinary folder (optional)
 * @returns Secure URL of the uploaded file or null on failure
 */
export async function uploadToCloudinary(
  filePath: string,
  folder: string = "elections"
): Promise<string | null> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder, // Stores file inside a specific folder in Cloudinary
      use_filename: true,
      unique_filename: false, // Keeps original filename
      resource_type: "image", // Ensures it's an image upload
    });

    // ✅ Delete temp file after successful upload
    fs.unlinkSync(filePath);

    return result.secure_url; // Return Cloudinary URL
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
}
