import dotenv from "dotenv";
import { logger, LogTypes } from "./util/logger";
import { Hub } from "@bakkchos/tube";
import map from "./services";
dotenv.config();
logger(LogTypes.INFO, process.env.APP_NAME!);

const hub = new Hub("http://localhost:3000/", process.env.APP_NAME!);

hub.register(map).then((res) => {
  logger(LogTypes.INFO, "Service registred");
  logger(LogTypes.DEBUG, JSON.stringify(res));
});
