<script lang="ts">
	import type { AppContext } from "../AppContext.svelte";
	import type { Channel } from "../types";
	interface Props {
		channels: Array<Channel>;
		appctx: AppContext;
	}
	let { channels, appctx }: Props = $props();
</script>

<ul>
	{#each channels as channel}
		<li>
			<button
				onclick={appctx.connectFunc(
					`ws://localhost:${channel.port}/${channel.band}/ws`,
				)}>{channel.band}</button
			>
		</li>
	{/each}
</ul>

<style>
	ul {
		margin-block: 0rem;
	}
</style>
