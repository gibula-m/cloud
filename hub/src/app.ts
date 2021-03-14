import dotenv from "dotenv";
import { logger, LogTypes } from "./util/logger";
import express from "express";
import * as appController from "./controller/app";
import { handle } from "./util/handler";
import bp from "body-parser";

dotenv.config();

const app = express();
app.use(bp.json());

app.post("/register/:id", handle(appController.register));

app.listen(3000, () => {
  logger(LogTypes.INFO, "App start on 3000");
});
