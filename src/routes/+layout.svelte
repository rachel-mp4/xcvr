<script lang="ts">
	import { page } from "$app/stores";
	import type { LayoutProps } from "./$types";
	import Spectrum from "$lib/components/Spectrum.svelte";
	import { getRkeyFromUri } from "$lib/utils";
	let { data, children }: LayoutProps = $props();
	console.log(data.channels);
	const uri = "at://did:plc:abc123/app.bsky.feed.post/3js5ubz2vlw2k";
	const rkey = getRkeyFromUri(uri);
	console.log(rkey);
</script>

<div id="content">
	<aside id="left-sidebar">
		<nav>
			<a href="/">
				{#if $page.url.pathname === "/"}
					& now you're home
				{:else}
					go home
				{/if}
			</a>
			<a href="/">
				{#if $page.url.pathname === "/"}
					sign in with atproto
				{:else}
					go home
				{/if}
			</a>
		</nav>

		<div class="beep">here's what's been happening recently</div>
		<Spectrum channels={data.channels}></Spectrum>
	</aside>
	{@render children()}
</div>

<style>
	#left-sidebar {
		position: sticky;
		top: 0;
	}
	#content {
		display: grid;
		position: relative;
		grid-template-columns: 20rem 1fr 20rem;
		height: 100vh;
	}
	.beep {
		margin-top: 16rem;
	}
	nav {
		top:0rem;
		line-height:1;
		border-bottom: .25rem solid white;
	}
	.x {
		text-shadow: -0.25rem -0.25rem #034732;
	}
	.c {
		text-shadow: -0.25rem -0.25rem #008148;
	}
	.v {
		text-shadow: -0.25rem -0.25rem #c6c013;
	}
	.r {
		text-shadow: -0.25rem -0.25rem #ef8a17;
	}

</style>
