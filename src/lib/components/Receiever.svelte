<script lang="ts">
  import Transmission from "$lib/components/Transmission.svelte";
  import type { Message } from "$lib/types";
  interface Props {
    messages: Array<Message>;
    mylocaltext?: string;
    onmute?: (id: number) => void;
    onunmute?: (id: number) => void;
    myHandle?: string;
  }
  let { messages, mylocaltext, onmute, onunmute, myHandle }: Props = $props();
</script>

<div id="receiver">
  {#each messages as message}
    <Transmission
      {message}
      mylocaltext={message.active && message.mine ? mylocaltext : undefined}
      margin={0}
      {myHandle}
      {onmute}
      {onunmute}
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
