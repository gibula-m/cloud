import dotenv from "dotenv";
import { logger, LogTypes } from "./util/logger";
import map from "./services";
dotenv.config();
logger(LogTypes.INFO, process.env.APP_NAME!);
