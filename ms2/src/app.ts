import bakkchos, { AMQPTransport } from "@bakkchos/tube";
import dotenv from "dotenv";
import { hello } from "./services/hello";

dotenv.config();

const transport = new AMQPTransport("localhost");
transport
  .init({
    client: process.env.APP_NAME!,
    node: "localhost:5672",
  })
  .then(() => {
    const app = bakkchos(transport);
    app.register("hello2", hello);
    app.start();
  });
