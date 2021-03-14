import dotenv from "dotenv";
import { logger, LogTypes } from "./util/logger";
import express from "express";
import * as appController from "./controller/app";
import { handle } from "./util/handler";

dotenv.config();

const app = express();

app.get("/register", appController.register);
