<script lang="ts">
  import DeleteSpectrum from "$lib/components/DeleteSpectrum.svelte";
  import type { PageProps } from "./$types";
  let { data }: PageProps = $props();
</script>

<main>
  <p>
    this isn't a true atproto delete, but you can use this to tell the backend
    to close up your channel for now. in the future there will be many more
    options for you to have finer controls. likely deleting a channel record
    from your repository will delete it on the backend if it's coded correctly,
    but behavior in the channel at that moment may be unpredictable!
  </p>
  <DeleteSpectrum channels={data.channels} />
</main>
