<script lang="ts">
	import type { ChannelView } from "$lib/types";
	import { getChannelUrl } from "$lib/utils";
	import { getContext } from "svelte";
	const tabContext = getContext<{
		curTab: string;
		gotoA: () => void;
		gotoB: () => void;
		gotoC: () => void;
	}>("tabs");
	interface Props {
		channels: Array<ChannelView>;
	}
	let { channels }: Props = $props();
</script>

<div id="spectrum">
	<div class="channels">
		{#each channels as channel}
			<a
				class="channel"
				href={getChannelUrl(channel) ?? "/"}
				onclick={() => {
					tabContext.gotoB();
				}}
			>
				<span class="title">{channel.title}</span>
				@{channel.creator.handle}
			</a>
		{/each}
	</div>
</div>

<style>
	#spectrum {
		position: relative;
		min-width: 15rem;
	}
	.channels {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
	.channel .title {
		color: inherit;
		text-decoration: none;
		font: inherit;
		padding: 0;
		margin: 0;
		background: none;
		border: none;
		cursor: pointer;
		font-weight: 700;
		font-size: 1.5rem;
	}
	.channel {
		font-size: 1rem;
	}
	.channel:hover {
		color: var(--bg);
		background: var(--fg);
	}
</style>
