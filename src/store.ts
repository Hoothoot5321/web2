import { writable } from "svelte/store";

export enum Type {
  CONNECT = "CONNECT",
  DISCONNECT = "DISCONNECT",
  SEND = "SEND",
  CREATE = "CREATE",
  STARTUP = "STARTUP",
  QUEARY = "QUEARY",
  IMAGE = "IMAGE",
}
export class StartupMessage {
  type: Type;
  channels: string[];
  id: number;

  constructor(type: Type, channels: string[], id: number) {
    this.type = type;
    this.channels = channels;
    this.id = id;
  }
}

export class Message {
  type: Type;
  msg: string;

  constructor(type: Type, msg: string) {
    this.type = type;
    this.msg = msg;
  }
}
export class Channel {
  name: string;
  clients: WebSocket[];
  constructor() {
    this.name = "";
    this.clients = [];
  }
}
export const messageStore = writable("");
const url = "wss://polite-swamp-wire.glitch.me/";

export const start = () => {
  const socket = new WebSocket(url);

  socket.addEventListener("open", function (event) {});

  socket.addEventListener("message", function (ev) {
    let msg = JSON.parse(ev.data) as Message;
    console.log(msg);
    switch (msg.type) {
      case Type.STARTUP:
        let message = JSON.parse(ev.data) as StartupMessage;
        channels.set(message.channels);
        id.set(message.id);
        break;
      case Type.CONNECT:
        connected_channel.set(msg.msg);
        break;
      case Type.CREATE:
        channels.set(JSON.parse(msg.msg) as string[]);
        console.log(msg);
        break;
      case Type.IMAGE:
        img_src.set(msg.msg);
        break;
      case Type.SEND:
        alert(msg.msg);
        break;
    }
  });
  const sendMessage = (msg: string, type: Type) => {
    socket.send(JSON.stringify(new Message(type, msg)));
  };
  return sendMessage;
};

export let channels = writable<string[]>([]);

export let id = writable(0);

export let connected_channel = writable("");

export let img_src = writable("");
