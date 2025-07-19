<script lang="ts">
	import { setContext } from "svelte";
	import { page } from "$app/stores";
	import type { LayoutProps } from "./$types";
	import Spectrum from "$lib/components/Spectrum.svelte";
	let { data, children }: LayoutProps = $props();
	let innerWidth = $state(0);
	let isDesktop = $derived(innerWidth > 1000);

	let curTab = $state("bbbbb");
	const tabContext = {
		get curTab() {
			return curTab;
		},
		gotoA: () => {
			curTab = "aaaaa";
		},
		gotoB: () => {
			curTab = "bbbbb";
		},
		gotoC: () => {
			curTab = "ccccc";
		},
	};

	setContext("tabs", tabContext);

	const evaluateClass = () => {
		if (isDesktop) {
			return "desktop";
		}
		switch (curTab) {
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
	<aside id="left-sidebar">
		<nav>
			<a
				class="block-link"
				href="/"
				onclick={() => {
					tabContext.gotoB();
				}}
			>
				{#if $page.url.pathname === "/"}
					& now you're home
				{:else}
					go home
				{/if}
			</a>
			{#if data.myProfile.handle !== "xcvr.org"}
				<a
					class="block-link"
					href="/p/{data.myProfile.handle}"
					onclick={() => {
						tabContext.gotoB();
					}}
				>
					i know who you are
				</a>
			{:else}
				<a
					class="block-link"
					href="/login"
					onclick={() => {
						tabContext.gotoB();
					}}
				>
					log in with atproto
				</a>
			{/if}
		</nav>

		<a
			class="block-link"
			href="/c/create"
			onclick={() => {
				tabContext.gotoB();
			}}
		>
			create a channel</a
		>
		<div class="beep">here's what's been happening recently</div>
		<Spectrum channels={data.channels}></Spectrum>
	</aside>
	{@render children()}
</div>

{#if !isDesktop}
	<div class="tab-container">
		<div>
			<input
				type="radio"
				id="aaaaa"
				name="tabs"
				bind:group={curTab}
				value="aaaaa"
			/>
			<label for="aaaaa">aaaaa</label>
		</div>
		<div>
			<input
				type="radio"
				id="bbbbb"
				name="tabs"
				bind:group={curTab}
				value="bbbbb"
			/>
			<label for="bbbbb">bbbbb</label>
		</div>
		<div>
			<input
				type="radio"
				id="ccccc"
				name="tabs"
				bind:group={curTab}
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
		width: 100%;
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
