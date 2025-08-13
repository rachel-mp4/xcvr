<script lang="ts">
  import Transmission from "$lib/components/Transmission.svelte";
  import type { Message } from "$lib/types";
  interface Props {
    messages: Array<Message>;
    mylocaltext?: string;
  }
  let { messages, mylocaltext }: Props = $props();
</script>

<div id="receiver">
  {#each messages as message}
    <Transmission
      {message}
      mylocaltext={message.active && message.mine ? mylocaltext : undefined}
      margin={0}
    />
  {/each}
</div>

<style>
  #receiver {
    width: 100%;
  }
</style>
