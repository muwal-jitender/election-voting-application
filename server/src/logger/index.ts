import DailyRotateFile from "winston-daily-rotate-file";
import { env } from "utils/env-config.utils";
import path from "path";
import winston from "winston";

// Destructure winston.format for better readability
const { combine, timestamp, errors, json, printf, colorize } = winston.format;

// Log format (JSON with timestamp and stack trace)
const logFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  json()
);

// Optional: Pretty log format for console in dev
const prettyFormat = combine(
  colorize(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(({ level, message, timestamp, stack }) => {
    return `[${timestamp}] ${level}: ${stack || message}`;
  })
);

// ✅ Define the absolute path to the `logs` directory in the project root
const logDir = path.join(__dirname, "../../../logs");

// Logger instance
const logger = winston.createLogger({
  level: env.LOG_LEVEL || "info", // fallback to 'info' if not defined
  format: logFormat,
  transports: [
    // ✅ Daily error logs
    new DailyRotateFile({
      filename: path.join(logDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "error",
      zippedArchive: true,
      maxSize: "10m",
      maxFiles: "14d", // Keep logs for 14 days
    }),

    // ✅ Daily combined logs
    new DailyRotateFile({
      filename: path.join(logDir, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "10m",
      maxFiles: "30d",
    }),
  ],
});

// ✅ Also log to console in development
if (env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: prettyFormat,
    })
  );
}

export default logger;

// Optional: Stream for morgan integration
export const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};
