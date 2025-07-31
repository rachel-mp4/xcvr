<script lang="ts">
  import type { PageProps } from "./$types";
  import { onDestroy } from "svelte";
  import { WSContext } from "$lib/wscontext.svelte";
  import Receiever from "$lib/components/Receiever.svelte";
  import Transmitter from "$lib/components/Transmitter.svelte";
  let { data }: PageProps = $props();
  let ctx = $derived(new WSContext(data.uri));

  $effect(() => {
    ctx?.disconnect();
    if (data.address) {
      ctx.connect(data.address);
      ctx.setNick(data.myProfile.defaultNick);
      ctx.setHandle(data.myProfile.handle);
      ctx.setColor(data.myProfile.color);
    }
  });
  onDestroy(() => ctx?.disconnect());
</script>

<main id="transceiver">
  <div>
    <a href="history"> view history </a>
  </div>
  {#if ctx?.topic}
    <div>{ctx?.topic}</div>
  {/if}
  {#if !ctx?.connected}
    <div>
      loading... probably something went wrong if you can read me, maybe
      refresh?
    </div>
  {/if}
  {#if ctx}
    <Receiever messages={ctx.messages} />
    <Transmitter
      {ctx}
      defaultNick={data.myProfile.defaultNick}
      defaultHandle={data.myProfile.handle}
    />
  {/if}
</main>
