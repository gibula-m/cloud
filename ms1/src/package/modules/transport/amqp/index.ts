import amqp, { Channel, Connection, ConsumeMessage } from "amqplib";
export interface Message {
  command: string;
  msg: string;
}
export class AMQPTransport {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private queue: string | null = null;
  constructor() {}
  async init(options: AMQPTransportOptions) {
    this.connection = await amqp.connect("amqp://" + options.node);
    this.channel = await this.connection.createChannel();
    this.queue = options.client;
    this.channel.assertQueue(this.queue);
  }
  async send(msg: Message) {
    this.channel!.sendToQueue(this.queue as string, Buffer.from(msg.msg));
  }
}

export interface AMQPTransportOptions {
  client: string;
  node: string;
}
