import { Request } from "express";
import morgan from "morgan";

// Add custom token for IP
morgan.token(
  "remote-addr",
  (req: Request) => (req.headers["x-forwarded-for"] as string) || req.ip
);

export const morganFormat =
  ":remote-addr :method :url :status :res[content-length] - :response-time ms";
