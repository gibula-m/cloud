import amqp, { Channel, Connection, ConsumeMessage } from "amqplib";
import axios from "axios";
import { resolve } from "bluebird";
import { v4 as uuidv4 } from "uuid";
export default class Tube {
  private url: string;
  private connection: Connection | null;
  private sn: string;
  private channel: Channel | null;
  private queue: amqp.Replies.AssertQueue | null;
  private QUEUE_PREFIX = "bakkchos/service/";
  constructor(url: string, serviceName: string) {
    this.url = url;
    this.connection = null;
    this.sn = serviceName;
    this.channel = null;
    this.queue = null;
  }
  async init() {
    this.connection = await amqp.connect(this.url);
    this.channel = await this.connection.createConfirmChannel();
  }
  async publish(msg: Payload) {
    const data = { data: msg, correlationId: uuidv4() };
    this.queue = await this.channel!.assertQueue(data.correlationId);
    this.channel?.sendToQueue(
      data.correlationId,
      Buffer.from(JSON.stringify(data))
    );
    return await new Promise((resolve) => {
      this.channel?.consume(
        data.correlationId,
        (msg: ConsumeMessage | null) => {
          if (msg) {
            this.channel?.deleteQueue(data.correlationId);
            const result = JSON.parse(msg.content.toString());
            resolve(result.data);
          }
        }
      );
    });
  }
}

export class Hub {
  private url;
  private serviceName;
  private REGISTER_PREFIX = "register/";
  constructor(url: string, serviceName: string) {
    this.url = url;
    this.serviceName = serviceName;
  }

  async register(map: Map<string, Function>) {
    const features = Array.from(map.keys());
    const result = await axios.post(
      this.url + this.REGISTER_PREFIX + this.serviceName,
      JSON.stringify(features),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export interface Payload {}
export interface PingPongPayload extends Payload {
  ping?: boolean;
  pong?: boolean;
}
