<script lang="ts">
  import type { PageProps } from "./$types";
  import { WSContext } from "$lib/wscontext.svelte";
  import Receiever from "$lib/components/Receiever.svelte";
  import Transmitter from "$lib/components/Transmitter.svelte";
  import Console from "$lib/components/Console.svelte";
  let { data }: PageProps = $props();
  let ctx = new WSContext();
  $effect(() => {
    if (data.address) {
      ctx.connect(data.address);
    } else {
      ctx.disconnect();
    }
  });
</script>

<main id="transceiver">
  {#if ctx.topic}
    <div>{ctx.topic}</div>
  {/if}

  <Receiever messages={ctx.messages} />
  <Transmitter {ctx} />
</main>
<aside id="transceiver-log">
  <Console log={ctx.log} />
</aside>

<style>
  #transceiver-log {
    word-break: break-all;
    text-wrap: wrap;
    position: sticky;
    bottom: 0;
  }
</style>
