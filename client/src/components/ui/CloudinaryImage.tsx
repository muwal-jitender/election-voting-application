import { cloudinaryService } from "utils/cloudinary.utils";

type CloudinaryImageProps = {
  cloudinaryUrl: string;
  alt: string;
  width: number;
  height: number;
  mobileWidth: number;
  mode: "fill" | "fit" | "limit" | "thumb";
  gravity: "auto" | "face" | "center";
  loading?: "eager" | "lazy";
};
const CloudinaryImage = ({
  cloudinaryUrl,
  alt,
  width,
  height,
  mobileWidth,
  mode,
  gravity,
  loading = "lazy",
}: CloudinaryImageProps) => {
  return (
    <img
      src={cloudinaryService.getOptimizedImageUrl(
        cloudinaryUrl,
        height,
        width,
        mode,
        gravity,
      )}
      alt={alt}
      srcSet={`
                ${cloudinaryService.getOptimizedImageUrl(cloudinaryUrl, height, width, mode, gravity)} ${width}w,
                ${cloudinaryService.getOptimizedImageUrl(cloudinaryUrl, height, mobileWidth, mode, gravity)} ${mobileWidth}w
                `}
      sizes={`(max-width: 600px) ${mobileWidth}px, ${width}px`}
      loading={loading}
      decoding="async"
    />
  );
};

export default CloudinaryImage;
