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
  .then(async () => {
    const app = bakkchos(transport);
    app.register("hello", hello);
    const data = await transport.send("hello2", { test: "TEST" });
    app.start();
  });
