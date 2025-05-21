export function validateEnv(env: NodeJS.ProcessEnv) {
  const requiredVars = [
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "TOTP_SECRET_KEY",
    "DB_URI",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  const missing = requiredVars.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables:\n${missing
        .map((key) => `- ${key}`)
        .join("\n")}`
    );
  }
}
