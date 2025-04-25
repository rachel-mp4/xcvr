<script lang="ts">
	import type { LayoutProps } from "./$types";
	import Spectrum from "$lib/components/spectrum.svelte";
	let { data, children }: LayoutProps = $props();
</script>

<Spectrum channels={data.message} />
<div>
	{@render children()}
</div>
