import dotenv from "dotenv";
import { logger, LogTypes } from "./util/logger";
import express from "express";
import * as appController from "./controller/app";
import { handle } from "./util/handler";
import bp from "body-parser";
import { initializeDatabase } from "./lib/database";

dotenv.config();

const app = express();
app.use(bp.json());

app.post("/register/:id", handle(appController.register));
app.get("/services", handle(appController.getServices));
app.get("/features/:name", handle(appController.getFeatures));
app.get("/service/:featureName", handle(appController.getServiceByFeatureName));

initializeDatabase().then(() => {
  logger(LogTypes.INFO, "Database initilized");
  app.listen(3000, () => {
    logger(LogTypes.INFO, "App start on 3000");
  });
});
