<script lang="ts" async>
  import { onMount } from "svelte";
  import {
    Type,
    start,
    id,
    channels,
    img_src,
    connected_channel,
  } from "../store";
  let channel_create_name = "";
  let temp_img_src = "";
  let _id: number;
  let _img_src: string;
  let _connected_channel: string;
  let _channels: string[];

  $: _id = $id;
  $: _channels = $channels;
  $: _img_src = $img_src;
  $: _connected_channel = $connected_channel;
  $: _img_src = $img_src;
  let sendMessage: Function;
  onMount(() => {
    sendMessage = start();
  });
  function onFileSelected(e: any) {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      if (e.target?.result) {
        temp_img_src = e.target.result.toString();
      }
    };
  }
</script>

<h1>Hello: {_id}</h1>
<h2>Kanaler</h2>
<div class="channel-list">
  {#each _channels as channel}
    {#if channel == _connected_channel}
      <button class="green" on:click={() => sendMessage(channel, Type.CONNECT)}
        >{channel}</button
      >
    {:else}
      <button class="red" on:click={() => sendMessage(channel, Type.CONNECT)}
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
<input
  accept="image/png, image/jpeg"
  type="file"
  name="file"
  on:change={onFileSelected}
/>
<br />
<button on:click={() => sendMessage(channel_create_name, Type.CREATE)}
  >Lav Kanal</button
>

<button on:click={() => sendMessage("Hello", Type.SEND)}>SENDO</button>

<button on:click={() => sendMessage(temp_img_src, Type.IMAGE)}
  >Send image</button
>
<br />
<img src={_img_src} alt="" srcset="" />
