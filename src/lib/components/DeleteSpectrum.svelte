<script lang="ts">
  import type { ChannelView } from "$lib/types";
  import { getChannelUrl } from "$lib/utils";
  interface Props {
    channels: Array<ChannelView>;
  }
  let { channels }: Props = $props();
  const deleteChannel = (channel: ChannelView) => {
    return async () => {
      const url = getChannelUrl(channel);
      if (url !== null) {
        const res = await fetch(url, {
          method: "DELETE",
        });
        const response = await res.json();
        channels = response;
      }
    };
  };
</script>

<div id="spectrum">
  <div class="channels">
    {#each channels as channel}
      <button class="channel" onclick={deleteChannel(channel)}>
        <span class="title">{channel.title}</span>
        @{channel.creator.handle}
      </button>
    {/each}
  </div>
</div>

<style>
  #spectrum {
    position: relative;
    min-width: 15rem;
  }
  .channels {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .channel .title {
    color: inherit;
    text-decoration: none;
    font: inherit;
    padding: 0;
    margin: 0;
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 700;
    font-size: 1.5rem;
  }
  .channel {
    font-size: 1rem;
  }
</style>
