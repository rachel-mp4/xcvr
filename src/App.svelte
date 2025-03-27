<script lang="ts">
  import Receiver from "./lib/Receiver.svelte";
  import Transmitter from "./lib/Transmitter.svelte";
  import { Context } from "./Context.svelte.ts";

  const ctx = new Context("ws://localhost:927/ws");
</script>

<main>
  <header>
    <h1><span style:color="#034732">x</span><span style:color="#008148">c</span><span style:color="#C6C013">v</span><span style:color="#EF8A17">r</span></h1>
    <h2>{ctx.topic}</h2>
  </header>
  <section>
    <Receiver messages={ctx.messages} />
    <Transmitter {ctx} />
  </section>
</main>

<style>
  header {
    position: sticky;
    top: 0;
    background-image: linear-gradient(white, #ffffff00);
    backdrop-filter: blur(0.25rem);
    mask-image: linear-gradient(black 80%, #0000 100%);
    padding-bottom: 1rem;
  }
  h1 {
    font-size: 4rem;
    margin: 0;
  }
  h2 {
    font-size: 3rem;
    margin: 0;
  }
  section {
    font-size: 2rem;
  }
</style>
