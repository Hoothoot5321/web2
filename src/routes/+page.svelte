<script lang="ts" async>
  import { onMount } from "svelte";
  let url = "wss://polite-swamp-wire.glitch.me/";
  const wss = new WebSocket(url);
  let channels: string[] = [];
  let channel_create_name = "";
  let connected_channel = "";
  let id = 0;
  let img_src = "";
  let temp_img_src = "";
  let img_file: FileList;
  let img_reader = new FileReader();
  $: if (img_file) {
    for (const fil of img_file) {
      img_reader.readAsDataURL(fil);
      img_reader.onload = () => {
        if (img_reader.result) {
          temp_img_src = img_reader.result.toString();
        }
      };
    }
  }
  enum Type {
    CONNECT = "CONNECT",
    DISCONNECT = "DISCONNECT",
    SEND = "SEND",
    CREATE = "CREATE",
    STARTUP = "STARTUP",
    QUEARY = "QUEARY",
    IMAGE = "IMAGE",
  }
  class StartupMessage {
    type: Type;
    channels: string[];
    id: number;

    constructor(type: Type, channels: string[], id: number) {
      this.type = type;
      this.channels = channels;
      this.id = id;
    }
  }

  class Message {
    type: Type;
    msg: string;

    constructor(type: Type, msg: string) {
      this.type = type;
      this.msg = msg;
    }
  }
  class Channel {
    name: string;
    clients: WebSocket[];
    constructor() {
      this.name = "";
      this.clients = [];
    }
  }

  onMount(() => {
    wss.send(JSON.stringify(new Message(Type.STARTUP, "Hello")));
  });
  wss.onmessage = (ev: MessageEvent<any>): void => {
    let msg = JSON.parse(ev.data) as Message;
    console.log(msg);
    switch (msg.type) {
      case Type.STARTUP:
        let message = JSON.parse(ev.data) as StartupMessage;
        channels = message.channels;
        id = message.id;
        break;
      case Type.CONNECT:
        connected_channel = msg.msg;
        break;
      case Type.CREATE:
        channels = JSON.parse(msg.msg) as string[];
        console.log(msg);
        break;
      case Type.IMAGE:
        img_src = msg.msg;
        break;
      case Type.SEND:
        alert(msg.msg);
        break;
    }
  };
  function createChan(channel_create_name: string): void {
    wss.send(JSON.stringify(new Message(Type.CREATE, channel_create_name)));
  }
  function sendMsg(msg: string, type: Type): void {
    wss.send(JSON.stringify(new Message(type, msg)));
  }

  function connectChan(channel_name: string): void {
    wss.send(JSON.stringify(new Message(Type.CONNECT, channel_name)));
  }
</script>

<h1>Hello: {id}</h1>
<h2>Kanaler</h2>
<div class="channel-list">
  {#each channels as channel}
    {#if channel == connected_channel}
      <button class="green" on:click={() => connectChan(channel)}
        >{channel}</button
      >
    {:else}
      <button class="red" on:click={() => connectChan(channel)}
        >{channel}</button
      >
    {/if}
  {/each}
</div>
<label for="channel_name">Channel Name</label>
<input type="text" name="channel_name" bind:value={channel_create_name} />
<br />
<label for="image_src">Img src</label>
<input type="text" name="image_src" bind:value={temp_img_src} />

<br />
<input accept="image/png, image/jpeg" bind:files={img_file} type="file" />
<br />
<button on:click={() => createChan(channel_create_name)}>Lav Kanal</button>

<button on:click={() => sendMsg("Hello", Type.SEND)}>SENDO</button>

<button on:click={() => sendMsg(temp_img_src, Type.IMAGE)}>Send image</button>
<br />
<img src={img_src} alt="" srcset="" />
