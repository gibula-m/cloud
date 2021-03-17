import { Message } from "../package/modules/transport/amqp";

export const hello = (msg: Message) => {
  console.log("HELLo");

  return "test";
};
