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
  {#if profile.displayName}<h3>{profile.displayName}</h3>{/if}
  <a href={`/a/${profile.handle}`}>@{profile.handle}</a>
  {#if profile.status}<div>{profile.status}</div>{/if}
</div>

<style>
  .profile {
    background: var(--bg);
  }
</style>
