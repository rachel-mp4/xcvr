<script lang="ts">
	import type { Channel } from "../types/types";
	interface Props {
		channels: Array<Channel>;
	}
	let { channels }: Props = $props();
</script>

<div id="spectrum">
	<div class="channels">
		{#each channels as channel}
			<a href="/{channel.band}">
				{channel.band}
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
	a {
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
	a::before {
		content: "#";
	}
</style>
