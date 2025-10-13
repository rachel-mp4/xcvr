<script lang="ts">
  import type { PageProps } from "./$types";
  import { dumbAbsoluteTimestamp, smartAbsoluteTimestamp } from "$lib/utils";
  let { data }: PageProps = $props();
  const fetchhandle = async (did: string) => {
    return fetch(`https://plc.directory/${did}`).then((res) => res.json());
  };
  const base = import.meta.env.VITE_API_URL;
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
  try to ban user
  <form action={`${base}/oauth/ban`} method="POST">
    <div>
      <label for="user">user to ban: </label>
      <input type="text" name="user" id="user" required />
    </div>
    <div>
      <label for="days">number of days to ban for: </label>
      <input type="text" name="days" id="days" />
    </div>
    <div>
      <label for="reason">reason: </label>
      <input type="text" name="reason" id="reason" />
    </div>
    <div>
      <input type="submit" value="ban" />
    </div>
  </form>
{/if}
