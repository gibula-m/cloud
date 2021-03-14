import amqp, { Channel, Connection } from "amqplib";
import axios from "axios";
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
    this.channel = await this.connection.createChannel();
    this.queue = await this.channel.assertQueue(this.QUEUE_PREFIX + this.sn);
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
