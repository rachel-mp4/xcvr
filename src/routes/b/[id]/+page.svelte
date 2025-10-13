<script lang="ts">
  import type { PageProps } from "./$types";
  import { dumbAbsoluteTimestamp, smartAbsoluteTimestamp } from "$lib/utils";
  let { data }: PageProps = $props();
  const fetchhandle = async (did: string) => {
    return fetch(`https://plc.directory/${did}`).then((res) => res.json());
  };
  const base = import.meta.env.VITE_API_URL;
</script>

<main>
  {#if data.ban}
    {#await fetchhandle(data.ban.did)}
      fetching handle
    {:then result}
      <h1>{result.alsoKnownAs[0]}</h1>
    {:catch}
      error fetching handle
    {/await}
    <p>
      ({data.ban.did}) was banned {smartAbsoluteTimestamp(
        Date.parse(data.ban.bannedAt),
      )}.
    </p>
    {#if data.ban.reason}
      <blockquote>
        <b>{data.ban.reason}</b>
      </blockquote>
    {/if}
    {#if data.ban.till}
      <p>
        {#if Date.parse(data.ban.till) > Date.now()}
          the ban will end on {dumbAbsoluteTimestamp(
            Date.parse(data.ban.till),
          )}.
        {:else}
          the ban ended {smartAbsoluteTimestamp(Date.parse(data.ban.till))}
        {/if}
      </p>
    {/if}
  {:else}
    i can't find ban
  {/if}
</main>

{#if data.myProfile.loggedIn}
  <aside>
    <h3>try to ban user</h3>
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
  </aside>
{/if}
