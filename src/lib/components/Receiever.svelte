<script lang="ts">
  import Transmission from "$lib/components/Transmission.svelte";
  import type { Message } from "$lib/types";
  interface Props {
    messages: Array<Message>;
  }
  let { messages }: Props = $props();
  function calculateMarginTop(
    currentTime: number | null,
    previousTime: number | null,
  ) {
    if (!previousTime || !currentTime) return 0;
    const elapsedMs = currentTime - previousTime;
    const elapsedMinutes = elapsedMs / (1000 * 60);
    return Math.log(elapsedMinutes + 1) * 10;
  }
</script>

<div id="receiver">
  {#each messages as message, i}
    <Transmission
      {message}
      margin={calculateMarginTop(
        message.startedAt,
        i > 0 ? messages[i - 1].startedAt : null,
      )}
    />
  {/each}
</div>

<style>
  #receiver {
    width: 100%;
  }
</style>
