<script lang="ts">
  import type { PageProps } from "./$types";
  import { dumbAbsoluteTimestamp, smartAbsoluteTimestamp } from "$lib/utils";
  let { data }: PageProps = $props();
  const fetchhandle = async (did: string) => {
    return fetch(`https://plc.directory/${did}`).then((res) => res.json());
  };
</script>

{#if data.ban}
  {#await fetchhandle(data.ban.did)}
    fetching handle
  {:then result}
    {result.alsoKnownAs[0]}
  {:catch}
    error fetching handle
  {/await}
  ({data.ban.did}) was banned {smartAbsoluteTimestamp(data.ban.bannedAt)}
  {#if data.ban.reason}
    for {data.ban.reason}.
  {/if}
  {#if data.ban.till}
    the ban will end on {dumbAbsoluteTimestamp(data.ban.till)}.
  {/if}
{:else}
  i can't find ban
{/if}

{#if data.myProfile.loggedIn}
  try to ban someone (TODO, MAKE UI FOR BAN)
{/if}
