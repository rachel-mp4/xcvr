<script lang="ts">
  import Transmission from "./Transmission.svelte";
  import type { Message } from "../types";
  interface Props {
    messages: Array<Message>;
  }
  let { messages }: Props = $props();
</script>

{#each messages as message}
  <Transmission {message} />
{/each}

