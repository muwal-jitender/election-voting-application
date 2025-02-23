import { Application } from "express";
import fileUpload from "express-fileupload";

export const configureFileUpload = (app: Application) => {
  app.use(
    fileUpload({
      useTempFiles: true, // ✅ Use temp files for better performance
      tempFileDir: "/tmp/", // ✅ Store temporary files in `/tmp`
      limits: { fileSize: 10 * 1024 * 1024 }, // ✅ Limit file size (10MB)
      abortOnLimit: true,
    })
  );
};
