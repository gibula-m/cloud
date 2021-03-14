import amqp, { Connection } from "amqplib";
import axios from "axios";
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
