export const cloudinaryService = {
  /**
   * 🔧 Generates a Cloudinary-optimized image URL.
   *
   * ✅ Modes:
   * - `fill`: Crop image to exactly fit width & height (may cut off content).
   * - `fit`: Fit whole image inside width & height (no cropping).
   * - `limit`: Like `fit` but prevents upscaling if the image is smaller.
   *
   * 🧠 Summary:
   * | Mode     | Behavior                                   |
   * |----------|--------------------------------------------|
   * | `fill`   | Crops the image to fill dimensions         |
   * | `fit`    | Fits whole image inside box, no crop       |
   * | `limit`  | Like `fit`, but avoids upscaling           |
   *
   * @param originalUrl - Original Cloudinary URL
   * @param height - Target image height
   * @param width - Target image width
   * @param mode - Cloudinary crop mode ('fill' | 'fit' | 'limit'), default = 'fill'
   * @returns Optimized Cloudinary image URL
   */
  getOptimizedImageUrl: (
    originalUrl: string,
    height: number,
    width: number,
    mode: "fill" | "fit" | "limit" = "fill",
  ) => {
    const options = `f_auto,q_auto,w_${width},h_${height},c_${mode}`;
    return originalUrl.replace("/upload/", `/upload/${options}/`);
  },
};
