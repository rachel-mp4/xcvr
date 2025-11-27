<script lang="ts">
  import type { PageProps } from "./$types";
  import History from "$lib/components/History.svelte";
  import type { SignedItemView } from "$lib/types";
  const nicify = (arr: Array<any>): Array<SignedItemView> => {
    return arr.map((element) => {
      if (element["$type"] === "org.xcvr.lrc.defs#signedMessageView") {
        return { ...element, type: "message" };
      } else if (element["$type"] === "org.xcvr.lrc.defs#signedMediaView")
        return { ...element, type: "image" };
    });
  };
  let { data }: PageProps = $props();
  let items = $state(nicify(data.items));
  let nextCursor = $state(data.cursor);
  let hasMore = $derived(!!nextCursor);
  let loading = $state(false);
  const base = import.meta.env.VITE_API_URL;
  const endpoint = "/xrpc/org.xcvr.lrc.getHistory";
  let query = $derived(`?channelURI=${data.uri}&cursor=${nextCursor}`);
  $effect(() => console.log(`${base}${endpoint}${query}`));
  $effect(() => console.log(items));
  let scrollContainer: HTMLElement;
  let shouldScrollToBottom = $state(true);

  $effect(() => {
    if (shouldScrollToBottom && scrollContainer && items.length > 0) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
      shouldScrollToBottom = false;
    }
  });
  const loadMore = async () => {
    if (loading || !hasMore || !nextCursor) return;
    loading = true;
    const oldScrollHeight = scrollContainer.scrollHeight;
    const oldScrollTop = scrollContainer.scrollTop;
    try {
      const base = import.meta.env.VITE_API_URL;
      const endpoint = "/xrpc/org.xcvr.lrc.getHistory";
      const query = `?channelURI=${data.uri}&cursor=${nextCursor}`;
      const res = await fetch(`${base}${endpoint}${query}`);
      const newData = await res.json();
      items = [...items, ...nicify(newData.messages)];
      nextCursor = newData.cursor;
      requestAnimationFrame(() => {
        const newScrollHeight = scrollContainer.scrollHeight;
        const heightDifference = newScrollHeight - oldScrollHeight;
        scrollContainer.scrollTop = oldScrollTop + heightDifference;
      });
    } catch (e) {
      console.error("failed to load more!", e);
    } finally {
      loading = false;
    }
  };
</script>

<main id="history" bind:this={scrollContainer}>
  {#if hasMore}
    {#if !loading}
      <button onclick={loadMore}> load more! </button>
    {:else}
      <span> loading... </span>
    {/if}
  {/if}
  {#if items && items.length !== 0}
    <History {items} />
  {:else}
    <h1>NO HISTORY</h1>
  {/if}
  <a href=".">go back</a>
</main>

<style>
  h1 {
    font-size: 4rem;
  }
  button {
    font-size: 2rem;
    line-height: 1;
    cursor: pointer;
    padding: 0;
    margin: 0;
    background: var(--fg);
    color: var(--bg);
  }
  button:hover {
    font-weight: 700;
  }
</style>
