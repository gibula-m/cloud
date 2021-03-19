import bakkchos, { AMQPTransport } from "@bakkchos/tube";
import dotenv from "dotenv";
import { hello } from "./services/hello";

dotenv.config();

const transport = new AMQPTransport();
transport
  .init({
    client: "",
    node: "",
  })
  .then(() => {
    const app = bakkchos(transport);
    app.register("hello", hello);
    app.start();
  });
