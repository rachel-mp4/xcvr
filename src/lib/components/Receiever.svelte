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
  const getFontSizeFor = (index: number): string => {
    const last = messages.length - 1;
    const diff = index - last;
    const guess = 2 - diff * 0.012987;
    const res = Math.min(Math.max(guess, 1), 2);
    return `${res}rem`;
  };
</script>

<div id="receiver">
  {#each messages as message, index}
    <Transmission
      {message}
      mylocaltext={message.active && message.mine ? mylocaltext : undefined}
      margin={0}
      {onmute}
      {onunmute}
      fs={getFontSizeFor(index)}
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
