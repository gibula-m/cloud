import amqp, { Channel, Connection, ConsumeMessage } from "amqplib";
import redis, { RedisClient } from "redis";
import { v4 as uuidv4 } from "uuid";
export interface Message {
  command: string;
  msg: MessageData;
  from: string;
  type: "REQ" | "RES";
  correlationId: string;
}
export class AMQPTransport {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private queue: string | null = null;

  private redisClient: RedisClient | null;

  constructor(host: string) {
    this.redisClient = redis.createClient({ host: host });
  }
  async init(options: AMQPTransportOptions) {
    this.connection = await amqp.connect("amqp://" + options.node);
    this.channel = await this.connection.createChannel();
    this.queue = options.client;
    this.channel.assertQueue(this.queue);
  }
  async send(command: string, message: MessageData) {
    const corId = uuidv4();
    const msg: Message = {
      command: command,
      from: this.queue!,
      msg: message,
      type: "REQ",
      correlationId: corId,
    };
    const dst = await new Promise<string | null>((resolve) => {
      this.redisClient?.get(command, (err, rep) => {
        resolve(rep);
      });
    });
    if (dst) {
      this.channel!.sendToQueue(dst, Buffer.from(JSON.stringify(msg)));
    }
    return new Promise((resolve) => {
      this.channel?.consume(this.queue!, (msg: ConsumeMessage | null) => {
        if (msg) {
          const data: Message = JSON.parse(msg.content.toString());
          if (data.correlationId === corId && data.type === "RES") {
            resolve(data.msg);
          }
        }
      });
    });
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
            correlationId: data.correlationId,
            type: "RES",
          };
          this.send(data.from, msgBack);
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

export interface MessageData {}
