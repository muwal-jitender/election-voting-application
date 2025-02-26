import path from "path";

export const UPLOADS_DIR = path.join(__dirname, "../../uploads"); // ✅ Centralized uploads directory

/**
 * Max file size = 10MB
 */
export const FILE_SIZE = 1000000; // 10MB
