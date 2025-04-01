import { v2 as cloudinary } from "cloudinary";
import { env } from "utils/env-config.utils";
import logger from "logger"; // ✅ Winston logger

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * ✅ Upload to Cloudinary
 * @param filePath - local file path to be uploaded
 * @param folder - optional folder inside Cloudinary
 * @returns uploaded image secure URL or null
 */
export async function uploadToCloudinary(
  filePath: string,
  folder: string = "elections"
): Promise<string | null> {
  try {
    logger.info(`📤 Uploading file to Cloudinary: ${filePath}`);

    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      use_filename: true,
      unique_filename: false,
      resource_type: "image",
    });

    logger.info(`✅ Upload successful: ${result.secure_url}`);
    return result.secure_url;
  } catch (error: any) {
    logger.error("❌ Cloudinary Upload Error", { error: error.message });
    return null;
  }
}

/**
 * ✅ Delete from Cloudinary
 * @param cloudinaryUrl - full Cloudinary image URL
 */
export const deleteFromCloudinary = async (cloudinaryUrl: string) => {
  try {
    const publicId = cloudinaryUrl.split("/").pop()?.split(".")[0];

    if (!publicId) {
      logger.warn(`⚠️ Could not extract publicId from: ${cloudinaryUrl}`);
      return;
    }

    const resourcePath = `elections/${publicId}`;
    await cloudinary.uploader.destroy(resourcePath);

    logger.info(`🗑️ Deleted from Cloudinary: ${resourcePath}`);
  } catch (error: any) {
    logger.error("❌ Cloudinary Deletion Failed", { error: error.message });
    throw error;
  }
};
