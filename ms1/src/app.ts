import dotenv from "dotenv";
import { logger, LogTypes } from "./util/logger";
import Tube, { Payload, PingPongPayload } from "./mock/index";
import map from "./services";
dotenv.config();
logger(LogTypes.INFO, process.env.APP_NAME!);
const tube = new Tube(
  "amqp://guest:guest@localhost:5672/",
  process.env.APP_NAME!
);
tube.init(map).then(async () => {
  logger(LogTypes.DEBUG, "AMQP Initialized");

  const payload: Payload = {
    command: "HELLO",
  };
  const result = await tube.publish(payload);
  console.log(result);
});
