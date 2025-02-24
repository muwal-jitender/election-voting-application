import { v2 as cloudinary } from "cloudinary";
import { env } from "../utils/env.config";

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

    return result.secure_url; // Return Cloudinary URL
  } catch (error: unknown) {
    console.error("Cloudinary Upload Error:", (error as Error).stack);
    return null;
  }
}

// ✅ Function to delete a file from Cloudinary
export const deleteFromCloudinary = async (cloudinaryUrl: string) => {
  try {
    const publicId = cloudinaryUrl.split("/").pop()?.split(".")[0]; // Extract public ID
    if (!publicId) return;

    await cloudinary.uploader.destroy(`elections/${publicId}`);
    console.log(`✅ Deleted from Cloudinary: ${cloudinaryUrl}`);
  } catch (error) {
    console.error("❌ Cloudinary Deletion Failed:", error);
  }
};
