import dotenv from "dotenv";
import bakkchos from "./package/index";
import { AMQPTransport } from "./package/modules/transport/amqp";
import { hello } from "./services/hello";
dotenv.config();

const transport = new AMQPTransport();
transport
  .init({
    client: process.env.APP_NAME as string,
    node: "localhost:5672",
  })
  .then(() => {
    const app = bakkchos(transport);
    app.register("hello", hello);
    app.start();
  });
