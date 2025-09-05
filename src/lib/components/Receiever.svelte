<script lang="ts">
  import Transmission from "$lib/components/Transmission.svelte";
  import type { Message } from "$lib/types";
  interface Props {
    messages: Array<Message>;
    mylocaltext?: string;
    onmute?: (id: number) => void;
    onunmute?: (id: number) => void;
  }
  let { messages, mylocaltext, onmute, onunmute }: Props = $props();
  let length = $derived(messages.length);
  let innerWidth = $state(0);
  let isDesktop = $derived(innerWidth > 1000);
</script>

<svelte:window bind:innerWidth />
<div id="receiver">
  {#each messages as message, index}
    {@const last = length - 1}
    {@const diff = last - index}
    {@const guess = 2 + (Math.atan((diff - 19) * 0.25) / -2.8 - 0.45)}
    {@const res = Math.min(Math.max(guess, 1), 2)}
    <Transmission
      {message}
      mylocaltext={message.active && message.mine ? mylocaltext : undefined}
      margin={0}
      {onmute}
      {onunmute}
      fs={isDesktop ? `${res}rem` : "1rem"}
    />
  {/each}
</div>

<style>
  #receiver {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
