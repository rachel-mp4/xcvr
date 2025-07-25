<script lang="ts">
  import Transmission from "$lib/components/Transmission.svelte";
  import type { Message } from "$lib/types";
  import { calculateMarginTop } from "$lib/utils";
  interface Props {
    messages: Array<Message>;
  }
  let { messages }: Props = $props();
</script>

<div id="receiver">
  {#each messages as message, i}
    <Transmission {message} margin={0} />
  {/each}
</div>

<style>
  #receiver {
    width: 100%;
  }
</style>
