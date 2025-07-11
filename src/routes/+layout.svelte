<script lang="ts">
	import { page } from "$app/stores";
	import type { LayoutProps } from "./$types";
	import Spectrum from "$lib/components/Spectrum.svelte";
	let { data, children }: LayoutProps = $props();
	let innerWidth = $state(0);
	let isDesktop = $derived(innerWidth > 1000);
	let curtab = $state("bbbbb");
	const evaluateClass = () => {
		if (isDesktop) {
			return "desktop";
		}
		switch (curtab) {
			case "aaaaa":
				return "tab-a";
			case "bbbbb":
				return "tab-b";
			case "ccccc":
				return "tab-c";
			default:
				return "";
		}
	};
	let curClass = $derived(evaluateClass());
</script>

<svelte:window bind:innerWidth />

<div id="content" class={curClass}>
	{#if isDesktop}
		<aside id="left-sidebar">
			<nav>
				<a class="block-link" href="/">
					{#if $page.url.pathname === "/"}
						& now you're home
					{:else}
						go home
					{/if}
				</a>
				{#if data.id}
					<a class="block-link" href="/p/{data.id.handle}">
						i know who you are
					</a>
				{:else}
					<a class="block-link" href="/login"> log in with atproto </a>
				{/if}
			</nav>

			<a class="block-link" href="/c/create"> create a channel</a>
			<div class="beep">here's what's been happening recently</div>
			<Spectrum channels={data.channels}></Spectrum>
		</aside>
	{/if}
	{@render children()}
</div>

{#if !isDesktop}
	<div class="tab-container">
		<div>
			<input
				type="radio"
				id="aaaaa"
				name="tabs"
				bind:group={curtab}
				value="aaaaa"
			/>
			<label for="aaaaa">aaaaa</label>
		</div>
		<div>
			<input
				type="radio"
				id="bbbbb"
				name="tabs"
				bind:group={curtab}
				value="bbbbb"
			/>
			<label for="bbbbb">bbbbb</label>
		</div>
		<div>
			<input
				type="radio"
				id="ccccc"
				name="tabs"
				bind:group={curtab}
				value="ccccc"
			/>
			<label for="ccccc">ccccc</label>
		</div>
	</div>
{/if}

<style>
	#left-sidebar {
		position: sticky;
		top: 0;
	}
	.tab-container {
		display: flex;
		justify-content: space-around;
		position: fixed;
		bottom: 0;
		font-size: 2rem;
		border-top: solid var(--fg) 0.25rem;
	}

	.tab-container input[type="radio"] {
		visibility: hidden;
		width: 0;
		height: 0;
		margin: 0;
	}

	.tab-container div:has(input:checked) {
		font-weight: 700;
	}
	#content.desktop {
		display: grid;
		position: relative;
		grid-template-columns: 20rem 1fr 20rem;
		height: 100vh;
	}
	.beep {
		margin-top: 16rem;
	}
	nav {
		top: 0rem;
		line-height: 1;
		border-bottom: 0.25rem solid var(--fg);
	}
</style>
