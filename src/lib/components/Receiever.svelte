<script lang="ts">
  import Transmission from "$lib/components/Transmission.svelte";
  import type { Message } from "$lib/types";
  interface Props {
    messages: Array<Message>;
  }
  let { messages }: Props = $props();
</script>

<div id="reciever">
{#each messages as message}
  <Transmission {message} />
{/each}  
</div>
<style>
  #reciever {
    width: 100%;
  }
</style> 