<script lang="ts">
	import type { LayoutProps } from "./$types";
	import Spectrum from "$lib/components/spectrum.svelte";
	let { data, children }: LayoutProps = $props();
</script>

<div id="content">
	<aside>
		<Spectrum channels={data.channels} />
	</aside>
	<main>
		{@render children()}
	</main>
</div>

<style>
	#content {
		display:flex;
	}
</style>
