<script lang="ts">
  import type { ProfileView } from "$lib/types";
  import { hexToContrast, hexToTransparent, numToHex } from "$lib/colors";
  interface Props {
    profile: ProfileView;
  }

  let { profile }: Props = $props();
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
  <div class="bsky-follower">bsky/follow</div>
</div>

<style>
  .profile {
    background: var(--bg);
    width: 18rem;
    color: var(--fg);
    display: flex;
  }
  h3 {
    margin: 0;
    font-size: 1.5rem;
  }
  .bsky-follower {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    font-size: 2rem;
  }
</style>
