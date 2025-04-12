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
  <header class={`${appctx.ctx ? "blur" : ""}`}>
    <h1>
      <button
        onclick={() => {
          if (appctx.ctx) {
            appctx = new AppContext();
          } else {
            appctx.explainer = !appctx.explainer
          }
        }}
      >
        <span style:color="#034732">x</span><span style:color="#008148">c</span
        ><span style:color="#C6C013">v</span><span style:color="#EF8A17">r</span
        >
      </button>
      {#if appctx.explainer}
        <div class="explainer"> xcvr (transceiver) is a web implementation of the LRC protocol. Where most text-based communication that occurs on the web is like mail—I compose my message, then I proofread it, then I send it to a correspondent who then has a permanent record of it—LRC is more like radio—I transmit my message as I compose it & anyone who is tuned into my band recieves an ephemeral signal. </div>
      {/if}
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
    {:else if appctx.ctx.connected}
      <div id="transceiver">
        <Receiver messages={appctx.ctx.messages} />
        <Transmitter ctx={appctx.ctx} />
      </div>
      
    {/if}
  </section>
</main>

<style>
  #transceiver {
    display: flex;
    flex-direction: column;
  }

  .blur {
    position: sticky;
    top: 0;
    background-image: linear-gradient(white, #ffffff00);
    backdrop-filter: blur(0.25rem);
    mask-image: linear-gradient(black 80%, #0000 100%);
    isolation: isolate;
  }

  h1 {
    font-size: 4rem;
    position: relative;
    display: inline-block;
    margin: 0;
    z-index: 1;
  }
  .explainer {
    position: absolute;
    top:calc(4rem - 6rex);
    left:100%;
    right:calc(100% - 100vw);
    max-width: 60vw;
    font-size: 1.5rem;
    font-weight: 400;
    z-index: 1;
    background: white;
    outline: .25rem solid black;
  }
  button {
    margin: 0;
    margin-right:.25rem;
    padding: 0;
    font: inherit;
    font-size: inherit;
    background: none;
    border: none;
    cursor: pointer;
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
