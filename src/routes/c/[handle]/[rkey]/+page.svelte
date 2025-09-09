<script lang="ts">
  import type { PageProps } from "./$types";
  import AutoGrowInput from "$lib/components/AutoGrowInput.svelte";
  import { onDestroy } from "svelte";
  import { WSContext } from "$lib/wscontext.svelte";
  import Receiever from "$lib/components/Receiever.svelte";
  import Transmitter from "$lib/components/Transmitter.svelte";
  import Console from "$lib/components/Console.svelte";
  import { numToHex } from "$lib/colors";
  import { getContext } from "svelte";
  const tabContext = getContext<{
    curTab: string;
    gotoA: () => void;
    gotoB: () => void;
    gotoC: () => void;
  }>("tabs");
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
  $effect(() => {
    console.log(data.channelView);
  });
</script>

<main id="transceiver">
  {#if !ctx?.connected}
    <div>
      connecting... <span class="error-message"
        >probably something went wrong if you can read me, maybe refresh?</span
      >
    </div>
  {/if}
  {#if ctx}
    {#if ctx.messages.length === 0 && ctx.connected}
      <div>connecting...</div>
      <div>and you're connected.</div>
      <div>messages will go here, start typing down below</div>
      <div>
        .................................................................|......
      </div>
      <div>
        .................................................................|......
      </div>
      <div>
        .................................................................|......
      </div>
      <div>
        .................................................................|......
      </div>
      <div>
        .................................................................|......
      </div>
      <div>
        .................................................................|......
      </div>
      <div>....................|...</div>
      <div>....................|...</div>
      <div>....................|...</div>
      <div>....................|...</div>
      <div>...........|...</div>
      <div>...........|...</div>
      <div>...........|...</div>
      <div>...........|...</div>
      <div>...........|...</div>
    {/if}
    <Receiever
      messages={ctx.messages}
      mylocaltext={ctx.curMsg}
      onmute={ctx.mute}
      onunmute={ctx.unmute}
    />
    <Transmitter
      {ctx}
      defaultNick={data.myProfile.defaultNick}
      defaultHandle={data.myProfile.handle}
    />
    <Console log={ctx.log} />
  {/if}
</main>
<aside style:--theme={numToHex(ctx.color)}>
  {#if data.channelView}
    <h1>
      {data.channelView.title}
    </h1>
  {/if}
  {#if ctx?.topic}
    <h2 class="topic">{ctx?.topic}</h2>
  {/if}
  <div>
    <a href="history"> view history </a>
  </div>
  <button
    id="settingsifier"
    onclick={() => {
      showSettings = !showSettings;
      if (showSettings) {
        tabContext.gotoC();
      }
    }}
  >
    {showSettings ? "hide" : "show"} settings
  </button>
  {#if ctx && showSettings}
    <h3>message obfuscation</h3>
    <p>in case you want to be forgotten...</p>
    <div id="obfuscation-settings">
      <div id="replacer">
        <div>replace message with</div>
        <div>
          <AutoGrowInput
            size={17}
            placeholder="some crap idk"
            bind:value={ctx.defaultmessage}
          />
        </div>
      </div>
      <div id="beepifier">
        <div><AutoGrowInput size={1} bind:value={ctx.junkword} />ifier</div>
        <input
          type="range"
          min="0"
          max="1"
          step=".01"
          bind:value={ctx.beepcoefficient}
        />
      </div>
      <div id="writer">
        <div>
          try to write message to your ({data.myProfile.handle}) user repo
        </div>
        <input type="checkbox" bind:checked={ctx.shouldSend} />
      </div>
      <div id="wanderer">
        <div>
          try to write message to xcvr's user repo (make sure to set handle
          before you start typing, that's when the signet is created!)
        </div>
        <input type="checkbox" bind:checked={ctx.postToMyRepo} />
      </div>
      <div id="transmittifier">
        <div>hyper-real-time transmission</div>
        <!-- this seems sus with the onclick, idk -->
        <input
          type="checkbox"
          bind:checked={ctx.shouldTransmit}
          onclick={() => {
            ctx.starttransmit();
          }}
        />
      </div>
    </div>
  {/if}
</aside>

<style>
  h1,
  h2,
  h3 {
    line-height: 1;
  }
  h1 {
    font-size: 4rem;
  }
  h2 {
    font-size: 2rem;
  }
  .topic {
    border-bottom: 0.25rem solid var(--fg);
  }
  h3 {
    font-size: 1.5rem;
    margin: 0;
  }
  .error-message {
    opacity: 0;
    animation: fadeIn 0.1s ease-in-out 1s forwards;
  }
  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }

  #transceiver {
    position: relative;
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }
  #settingsifier {
    align-self: flex-start;
  }
  #obfuscation-settings {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  button {
    font-size: 1rem;
    background-color: transparent;
    border: none;
    color: var(--fg);
    padding: 0;
    cursor: pointer;
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
