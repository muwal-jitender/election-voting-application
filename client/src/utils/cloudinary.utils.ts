export const cloudinaryService = {
  /**
   * 🔧 Generates an optimized Cloudinary image URL with transformation parameters.
   *
   * 🖼️ Purpose:
   * Dynamically optimize image delivery by adjusting format, quality, size, and cropping behavior.
   *
   * ✅ Modes (`c_*` - crop mode):
   * - `fill`: Crops image to exactly match width & height, may trim edges.
   * - `fit`: Fits the full image inside the dimensions, no cropping.
   * - `limit`: Same as `fit` but prevents upscaling smaller images.
   * - `thumb`: Smart thumbnail cropping (often paired with `gravity: face`).
   *
   * 🎯 Gravity (`g_*` - focus point for cropping):
   * - `auto`: Lets Cloudinary decide best focus (default).
   * - `face`: Focuses cropping around detected face.
   * - `center`: Crops around the center of the image.
   *
   * 🧠 Summary Table:
   * | Crop Mode | Description                             | Suggested Gravity |
   * |-----------|-----------------------------------------|-------------------|
   * | fill      | Crops image to fit exact dimensions     | auto or center    |
   * | fit       | Fits full image, may leave whitespace   | auto              |
   * | limit     | Like `fit`, but avoids upscaling        | auto              |
   * | thumb     | Smart crop for profile/head-shots        | face              |
   *
   * @param originalUrl - Original Cloudinary image URL
   * @param height - Desired image height
   * @param width - Desired image width
   * @param mode - Cloudinary crop mode (default: 'fill')
   * @param gravity - Crop focus point (default: 'auto')
   * @returns Optimized Cloudinary image URL
   */

  getOptimizedImageUrl: (
    originalUrl: string,
    height: number,
    width: number,
    mode: "fill" | "fit" | "limit" | "thumb" = "fill",
    gravity: "auto" | "face" | "center" = "auto",
  ) => {
    const options = `f_auto,q_auto,w_${width},h_${height},c_${mode},g_${gravity}`;
    return originalUrl.replace("/upload/", `/upload/${options}/`);
  },
};
