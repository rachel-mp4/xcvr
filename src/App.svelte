<script lang="ts">
  import Thread from "./lib/Thread.svelte";
  import { connectTo } from "./websocket";  
  import { Context } from "./Context.svelte.ts"

  const ctx = new Context()
  connectTo("ws://localhost:927/ws", ctx);
</script>

<main>
  <h1>xcvr</h1>
  <h2>{ctx.topic}</h2>
  <Thread messages={ctx.messages} />
</main>
