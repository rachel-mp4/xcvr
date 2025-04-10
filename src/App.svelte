<script lang="ts">
  import Receiver from "./lib/Receiver.svelte";
  import Transmitter from "./lib/Transmitter.svelte";
  import { getChannels } from "./fetcher.ts";
  import type { Channel } from "./types.ts";
  import Spectrum from "./lib/Spectrum.svelte";
  import { AppContext } from "./AppContext.svelte.ts";
  let channelsPromise: Promise<Channel[]> = getChannels();
  let appctx = $state(new AppContext());
</script>

<main>
  <header>
    <h1>
      <span style:color="#034732">x</span><span style:color="#008148">c</span
      ><span style:color="#C6C013">v</span><span style:color="#EF8A17">r</span>
    </h1>
    {#if appctx.ctx}
      <h2>{appctx.ctx.topic}</h2>
    {/if}
  </header>
  <section>
    {#if !appctx.ctx}
      {#await channelsPromise}
        fetching...
      {:then channels}
        <Spectrum {channels} {appctx} />
      {:catch err}
        error! {err}
      {/await}
    {:else}
      {#if appctx.ctx.connected}
      <Receiver messages={appctx.ctx.messages} />
      <Transmitter ctx={appctx.ctx} />
      {/if}
    {/if}
  </section>
</main>

<style>
  header {
    position: sticky;
    top: 0;
    background-image: linear-gradient(white, #ffffff00);
    backdrop-filter: blur(0.25rem);
    mask-image: linear-gradient(black 80%, #0000 100%);
  }

  h1 {
    font-size: 4rem;
    margin: 0;
  }

  h2 {
    padding-bottom: 1rem;
    font-size: 3rem;
    margin: 0;
  }

  section {
    font-size: 2rem;
  }
</style>
