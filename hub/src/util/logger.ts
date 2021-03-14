export const logger = (type: LogTypes, message: string) => {
  console.log(JSON.stringify({ ts: new Date(), lvl: type, message: message }));
};

export enum LogTypes {
  INFO = "INFO",
  DEBUG = "DEBUG",
  ERR = "ERR",
}
