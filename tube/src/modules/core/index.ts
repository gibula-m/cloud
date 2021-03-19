import { AMQPTransport, MessageData } from "../transport/amqp";

export class Bakkchos {
  private transport: AMQPTransport;
  private map = new Map<string, Function>();
  constructor(t: AMQPTransport) {
    this.transport = t;
  }
  register(command: string, action: Function) {
    this.map.set(command, action);
    this.transport.register(command);
  }
  start() {
    this.transport.consume(this.map);
  }
  publish(command: string, msg: MessageData) {
    this.transport.send(command, msg);
  }
}
