<script lang="ts">
  import Transmission from "$lib/components/Transmission.svelte";
  import type { SignedMessageView } from "$lib/types";
  import { calculateMarginTop, signedMessageViewToMessage } from "$lib/utils";
  interface Props {
    messages: Array<SignedMessageView>;
  }
  let { messages }: Props = $props();
</script>

<div id="receiver">
  {#each [...messages].reverse() as message, i}
    <Transmission
      message={signedMessageViewToMessage(message)}
      margin={calculateMarginTop(
        Date.parse(message.postedAt),
        i > 0 ? Date.parse(messages[i - 1].postedAt) : null,
      )}
    />
  {/each}
</div>

<style>
  #receiver {
    width: 100%;
  }
</style>
