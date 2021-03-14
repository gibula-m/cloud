import { hello } from "./hello";

const map = new Map<string, Function>();

map.set("HELLO", hello);

export default map;
