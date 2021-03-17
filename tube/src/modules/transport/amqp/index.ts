import amqp, { Channel, Connection, ConsumeMessage } from "amqplib";
export interface Message {
  command: string;
  msg: string;
  from: string;
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
  async send(to: string, msg: Message) {
    this.channel!.sendToQueue(to as string, Buffer.from(msg.msg));
  }

  consume(map: Map<string, Function>) {
    this.channel?.consume(this.queue!, async (msg: ConsumeMessage | null) => {
      if (msg) {
        const data: Message = JSON.parse(msg?.content.toString());
        const method = map.get(data.command);
        if (method) {
          const result = await method(data.msg);
          const msgBack: Message = {
            command: data.command,
            from: data.from,
            msg: result,
          };
          this.send(data.from, msgBack);
          console.log("Response sent");
        } else console.log("METHOD NOT IMPLEMENTED");
      }

      this.channel?.ack(msg!);
    });
  }
}

export interface AMQPTransportOptions {
  client: string;
  node: string;
}
