import amqp, { Channel, Connection, ConsumeMessage } from "amqplib";
import axios from "axios";
import { resolve } from "bluebird";
import { v4 as uuidv4 } from "uuid";
export default class Tube {
  private url: string;
  private connection: Connection | null;
  private sn: string;
  private channel: Channel | null;
  queue: amqp.Replies.AssertQueue | null;
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
    this.queue = await this.channel!.assertQueue(this.QUEUE_PREFIX + this.sn);
  }
  async publish(msg: Payload) {
    const data = { data: msg, correlationId: uuidv4() };
    const queue = map.get(msg.command);
    if (queue === undefined) {
      throw new Error("Method not implemented");
    }
    this.channel?.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
  }
}

export interface Payload {
  command: string;
}
export interface PingPongPayload extends Payload {
  ping?: boolean;
  pong?: boolean;
}

let map = new Map<string, string>([
  ["HELLO", "ms1"],
  ["HELLO2", "ms2"],
]);
