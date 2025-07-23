<script lang="ts">
  import type { ProfileView } from "$lib/types";
  interface Props {
    profile: ProfileView;
  }

  let { profile }: Props = $props();
</script>

<div class="profile">
  {#if profile.displayName}<h3>{profile.displayName}</h3>{/if}
  <a href={`/a/${profile.handle}`}>@{profile.handle}</a>
  {#if profile.status}<div>{profile.status}</div>{/if}
</div>
