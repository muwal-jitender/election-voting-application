import morgan from "morgan";
import { morganFormat } from "logger/morgan.format";
import { morganStream } from "logger";

export const requestLogger = morgan(morganFormat, {
  stream: morganStream,
});
