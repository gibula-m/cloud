import dotenv from "dotenv";
import { logger, LogTypes } from "./util/logger";
import Tube, { Hub, PingPongPayload } from "@bakkchos/tube";
import map from "./services";
dotenv.config();
logger(LogTypes.INFO, process.env.APP_NAME!);

const tube = new Tube(
  "amqp://guest:guest@localhost:5672/",
  process.env.APP_NAME!
);
tube.init().then(() => {
  logger(LogTypes.DEBUG, "AMQP Initialized");
  const hub = new Hub("http://localhost:3000/", process.env.APP_NAME!);

  const payload: PingPongPayload = {
    ping: true,
  };

  tube.publish(payload).then((result) => {
    console.log(result);
  });

  hub.register(map).then((res) => {
    logger(LogTypes.INFO, "Service registred");
    logger(LogTypes.DEBUG, JSON.stringify(res));
  });
});
