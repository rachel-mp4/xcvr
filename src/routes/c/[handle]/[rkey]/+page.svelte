<script lang="ts">
  import type { PageProps } from "./$types";
  import AutoGrowInput from "$lib/components/AutoGrowInput.svelte";
  import { onDestroy } from "svelte";
  import { WSContext } from "$lib/wscontext.svelte";
  import Receiever from "$lib/components/Receiever.svelte";
  import Transmitter from "$lib/components/Transmitter.svelte";
  import Console from "$lib/components/Console.svelte";
  import { numToHex } from "$lib/colors";
  let { data }: PageProps = $props();
  let ctx = $derived(
    new WSContext(
      data.uri,
      data.myProfile.handle,
      data.myProfile.defaultNick,
      data.myProfile.color,
    ),
  );

  $effect(() => {
    ctx?.disconnect();
    if (data.address) {
      ctx.connect(data.address);
    }
  });
  onDestroy(() => ctx?.disconnect());
  let showSettings = $state(false);
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
    <Receiever messages={ctx.messages} mylocaltext={ctx.curMsg} />
    <Transmitter
      {ctx}
      defaultNick={data.myProfile.defaultNick}
      defaultHandle={data.myProfile.handle}
    />
    <button
      onclick={() => {
        showSettings = !showSettings;
      }}
    >
      {showSettings ? "hide" : "show"} settings
    </button>
    <Console log={ctx.log} />
  {/if}
</main>
{#if ctx && showSettings}
  <aside style:--theme={numToHex(ctx.color)}>
    <div><AutoGrowInput bind:value={ctx.junkword} />ifier</div>
    <input
      type="range"
      min="0"
      max="1"
      step=".01"
      bind:value={ctx.beepcoefficient}
    />
    <div>should i save my message?</div>
    <input type="checkbox" bind:checked={ctx.shouldSend} />
  </aside>
{/if}

<style>
  #transceiver {
    position: relative;
  }
  button {
    font-size: 1rem;
    background-color: transparent;
    border: none;
    color: var(--fg);
    padding: 0;
  }
  button:hover {
    font-weight: 700;
  }
  input {
    accent-color: var(--theme);
  }
  main {
    margin-bottom: 70vh;
    margin-bottom: 70dvh;
  }
</style>
