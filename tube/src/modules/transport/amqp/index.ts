import amqp, { Channel, Connection, ConsumeMessage } from "amqplib";
import { resolve } from "node:path";
import redis, { RedisClient } from "redis";
export interface Message {
  command: string;
  msg: string;
  from: string;
}
export class AMQPTransport {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private queue: string | null = null;

  private commandsMap = new Map<string, string>();
  private redisClient: RedisClient | null;

  constructor() {
    this.redisClient = redis.createClient();
  }
  async init(options: AMQPTransportOptions) {
    this.connection = await amqp.connect("amqp://" + options.node);
    this.channel = await this.connection.createChannel();
    this.queue = options.client;
    this.channel.assertQueue(this.queue);
  }
  async send(msg: Message) {
    const dst = await new Promise<string | null>((resolve) => {
      this.redisClient?.get(msg.command, (err, rep) => {
        resolve(rep);
      });
    });
    console.log("SENDT TO : " + dst);
    if (dst) {
      this.channel!.sendToQueue(dst, Buffer.from(JSON.stringify(msg)));
    }
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
          this.send(msgBack);
          console.log("Response sent");
        } else console.log("METHOD NOT IMPLEMENTED");
      }

      this.channel?.ack(msg!);
    });
  }
  register(command: string) {
    this.redisClient?.set(command, this.queue!);
  }
}

export interface AMQPTransportOptions {
  client: string;
  node: string;
}
