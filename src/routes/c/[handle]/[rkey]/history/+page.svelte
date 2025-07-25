<script lang="ts">
  import type { PageProps } from "./$types";
  import History from "$lib/components/History.svelte";
  let { data }: PageProps = $props();
  let messages = $state(data.messages);
  let nextCursor = $state(data.cursor);
  let hasMore = $derived(!!nextCursor);
  let loading = $state(false);
  const base = import.meta.env.VITE_API_URL;
  const endpoint = "/xrpc/org.xcvr.lrc.getMessages";
  let query = $derived(`?channelURI=${data.uri}&cursor=${nextCursor}`);
  $effect(() => console.log(`${base}${endpoint}${query}`));
  $effect(() => console.log(messages));
  let scrollContainer: HTMLElement;
  let shouldScrollToBottom = $state(true);

  $effect(() => {
    if (shouldScrollToBottom && scrollContainer && messages.length > 0) {
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
      const endpoint = "/xrpc/org.xcvr.lrc.getMessages";
      const query = `?channelURI=${data.uri}&cursor=${nextCursor}`;
      const res = await fetch(`${base}${endpoint}${query}`);
      const newData = await res.json();
      messages = [...messages, ...newData.messages];
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
  {#if messages}
    <History {messages} />
  {:else}
    <h1>NO HISTORY</h1>
  {/if}
  <a href=".">go back</a>
</main>
