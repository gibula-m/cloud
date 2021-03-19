import bakkchos, { AMQPTransport } from "@bakkchos/tube";
import dotenv from "dotenv";
import { hello } from "./services/hello";

dotenv.config();

const transport = new AMQPTransport();
transport
  .init({
    client: process.env.APP_NAME as string,
    node: "localhost:5672",
  })
  .then(() => {
    console.log("Transport initialized");
    const app = bakkchos(transport);
    app.register("hello", hello);
    transport.send({ command: "hello2", msg: "treeee", from: "ms1" });
    app.start();
  });
