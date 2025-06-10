<script lang="ts">
  import Transmission from "$lib/components/Transmission.svelte";
  import type { Message } from "$lib/types";
  interface Props {
    messages: Array<Message>;
  }
  let { messages }: Props = $props();
</script>

<div id="receiver">
  {#each messages as message}
    <Transmission {message} />
  {/each}
</div>

<style>
  #receiver {
    width: 100%;
  }
</style>
