import { Application } from "express";
import fileUpload from "express-fileupload";

export const configureFileUpload = (app: Application) => {
  app.use(
    fileUpload({
      useTempFiles: true, // ✅ Store files in temporary storage
      limits: { fileSize: 10 * 1024 * 1024 }, // ✅ 10MB limit
      abortOnLimit: true, // ✅ Prevents large files from overloading memory
      safeFileNames: true, // ✅ Sanitizes file names
      preserveExtension: true, // ✅ Keeps file extension
    })
  );
};
