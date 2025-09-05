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
</script>

<div id="receiver">
  {#each messages as message, index}
    {@const last = length - 1}
    {@const diff = last - index}
    {@const guess = 2 + (Math.atan((diff - 25) * 0.25) / -2.8 - 0.45)}
    {@const res = Math.min(Math.max(guess, 1), 2)}
    <Transmission
      {message}
      mylocaltext={message.active && message.mine ? mylocaltext : undefined}
      margin={0}
      {onmute}
      {onunmute}
      fs={`${res}rem`}
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
