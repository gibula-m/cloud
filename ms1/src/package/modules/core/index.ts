import { AMQPTransport, Message } from "../transport/amqp";

export class Bakkchos {
  private transport: AMQPTransport;
  private map = new Map<string, Function>();
  constructor(t: AMQPTransport) {
    this.transport = t;
  }
  register(command: string, action: Function) {
    this.map.set(command, action);
  }
  start() {
    //consume
  }
  publish(msg: Message) {
    this.transport.send(msg);
  }
}
