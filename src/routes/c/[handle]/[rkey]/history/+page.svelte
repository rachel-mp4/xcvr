<script lang="ts">
  import type { PageProps } from "./$types";
  import History from "$lib/components/History.svelte";
  let { data }: PageProps = $props();
  let messages = $state(data.messages);
  let nextCursor = $state(data.cursor);
  let hasMore = $state(!!data.cursor);
  let loading = $state(false);
  const loadMore = async () => {
    if (loading || !hasMore || !nextCursor) return;
    loading = true;
    try {
      const base = import.meta.env.VITE_API_URL;
      const endpoint = "/xrpc/org.xcvr.lrc.getMessages";
      const query = `?channelURI=${data.uri}&cursor=${nextCursor}`;
      const res = await fetch(`${base}${endpoint}${query}`);
      const newData = await res.json();
      messages = [...newData.messages, ...messages];
      nextCursor = newData.cursor;
      hasMore = !!newData.cursor;
    } catch (e) {
      console.error("failed to load more!", e);
    } finally {
      loading = false;
    }
  };
</script>

<main id="history">
  {#if hasMore}
    {#if !loading}
      <button onclick={loadMore}> load more! </button>
    {:else}
      <span> loading... </span>
    {/if}
  {/if}
  {#if messages}
    <History {messages} />
  {/if}
</main>
