<script lang="ts">
	import type { LayoutProps } from "./$types";
	import Spectrum from "$lib/components/Spectrum.svelte";
	let { data, children }: LayoutProps = $props();
</script>

<div id="content">
	<aside>
		<h1>
			<a href="/" >
				<span style:color="#034732">x</span><span style:color="#008148"
					>c</span
				><span style:color="#C6C013">v</span><span style:color="#EF8A17"
					>r</span
				>
			</a>
		</h1>
		<Spectrum channels={data.channels} />
	</aside>
	<main>
		{@render children()}
	</main>
</div>

<style>
	#content {
		display: flex;
	}
	a {
		font-size: 2rem;
		text-decoration: none;
		font-weight: 700;
	}
</style>
