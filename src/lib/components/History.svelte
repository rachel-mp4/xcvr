<script lang="ts">
  import MessageTransmission from "$lib/components/MessageTransmission.svelte";
  import type { SignedMessageView } from "$lib/types";
  import { calculateMarginTop, signedMessageViewToMessage } from "$lib/utils";
  interface Props {
    messages: Array<SignedMessageView>;
  }
  let { messages }: Props = $props();
</script>

<div id="receiver">
  {#each [...messages].reverse() as message, i}
    <MessageTransmission
      message={signedMessageViewToMessage(message)}
      margin={0}
    />
  {/each}
</div>

<style>
  #receiver {
    width: 100%;
  }
</style>
