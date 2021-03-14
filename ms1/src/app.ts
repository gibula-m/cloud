import dotenv from "dotenv";
import { logger, LogTypes } from "./util/logger";
dotenv.config();
logger(LogTypes.INFO, process.env.APP_NAME!);
