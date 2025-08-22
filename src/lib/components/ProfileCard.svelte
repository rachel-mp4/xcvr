<script lang="ts">
  import type { ProfileView } from "$lib/types";
  import { hexToContrast, hexToTransparent, numToHex } from "$lib/colors";
  interface Props {
    profile: ProfileView;
    myHandle?: string;
  }

  let { profile, myHandle }: Props = $props();
  let bg = $derived(numToHex(profile.color ?? 0));
  let bl = $derived(hexToTransparent(bg));
  let fg = $derived(hexToContrast(bg));
  let fl = $derived(hexToTransparent(fg));
</script>

<div class="profile" style="--bg: {bg}; --bl: {bl}; --fg: {fg}; --fl: {fl}">
  <div class="card-body">
    {#if profile.displayName}<h3>{profile.displayName}</h3>{/if}
    <a href={`/a/${profile.handle}`}>@{profile.handle}</a>
    {#if profile.status}<div>{profile.status}</div>{/if}
  </div>
  {#if myHandle}
    <button class="bsky-follower">bsky/</button>
  {/if}
</div>

<style>
  .profile {
    background: var(--bg);
    width: 18rem;
    color: var(--fg);
    display: flex;
    flex-direction: column;
  }
  h3 {
    margin: 0;
    font-size: 1.5rem;
  }
  button {
    line-height: 1;
    cursor: pointer;
    padding: 0;
    margin: 0;
    background: var(--fg);
    color: var(--bg);
  }
  .bsky-follower {
    font-size: 1.5rem;
  }
</style>
