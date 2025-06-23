<script lang="ts">
  import type { PageProps } from "./$types";
  import { numToHex } from "$lib/colors"
  let { data }: PageProps = $props();
</script>

<main>
  {#if data.profile}
    <h1 class="display name">
      {data.profile.displayName}
    </h1>
    <h2 class="display">
      <a href="{data.profile.handle}">
      @{data.profile.handle}
      </a>
    </h2>
    <p>
      {data.profile.status}
    </p>
  {/if}
</main>
{#if data?.id?.handle && data?.profile?.handle && data.id.handle === data.profile.handle}
<aside>
  <p>
    you can change your profile here, press the i'm done button when you have finished to save your new profile
  </p>
  <form action="{import.meta.env.VITE_API_URL}/oauth/login" method="POST">
  <div>
    <label for="displayName">
      display name, this is what shows in most atproto stuff
    </label>
    <input
      type="text"
      name="displayName"
      placeholder="alice rulez"
      value="{data.profile.displayName}" 
      required
    /></div><div>
    <label for="defaultNick">
      default nickname, which is what shows just in the lrc chats by default
    </label>
    <input
      type="text"
      name="defaultNick"
      placeholder="alice"
      value="{data.profile?.defaultNick}" 
      required
    /></div><div>
    <label for="status">
      this is your status / bio, you can put extra stuff here if you'd like to share more about yourself
    </label>
    <textarea
      type="text"
      name="status"
      placeholder="hi i'm alice"
      value="{data.profile?.status}" 
      required
    /></div><div>
    <label for="color">
    this is your accent color, make sure to pick something cool and trendy to drive your personal brand awareness
    </label>
    <input
      type="color"
      name="color"
      value="{numToHex(data.profile?.color)}"
    /></div>

  </form>
</aside>
{/if}

<style>
  .name {
    font-size: 4rem;
  }
  h2 {
    margin: 0;
  }
</style>
