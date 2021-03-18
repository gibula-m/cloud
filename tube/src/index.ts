import { Bakkchos } from "./modules/core/index";
import { AMQPTransport } from "./modules/transport/amqp/index";
export {
  AMQPTransport,
  AMQPTransportOptions,
} from "./modules/transport/amqp/index";
export default (transport: AMQPTransport) => {
  return new Bakkchos(transport);
};
