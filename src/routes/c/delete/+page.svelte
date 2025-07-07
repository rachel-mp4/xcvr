<script lang="ts">
  import DeleteSpectrum from "$lib/components/DeleteSpectrum.svelte";
  import type { PageProps } from "./$types";
  let { data }: PageProps = $props();
</script>

<main>
  <DeleteSpectrum channels={data.channels} />
</main>
