<script lang="ts">
  import type { PageProps } from "./$types";
  let { data }: PageProps = $props();
</script>

<main>
  {#if data.profile}
    <h1>
      {data.profile.displayName}
    </h1>
    <h2>
      <a href="{data.profile.handle}">
      @{data.profile.handle}
      </a>
    </h2>
    <p>
      {data.profile.status}
    </p>
  {/if}
</main>
