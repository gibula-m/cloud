import dotenv from "dotenv";
import bakkchos from "@bakkchos/tube";
import AMQPTransport from "@bakkchos/tube";
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
