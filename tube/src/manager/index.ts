import amqp, { Connection } from "amqplib";
import Bluebird from "bluebird";
export default class Broker {
  private url: string;
  private connection: Connection | null;
  constructor(url: string) {
    this.url = url;
    this.connection = null;
  }
  async init() {
    this.connection = await amqp.connect(this.url);
  }
}
