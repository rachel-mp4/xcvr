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
			<button>
				{channel.band}
			</button>
		{/each}
	</div>
</div>

<style>
	#spectrum {
		position: relative;
	}
	.channels {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
	button {
		font: inherit;
		padding: 0;
		margin: 0;
		background: none;
		border: none;
		cursor: pointer;
		font-weight: 700;
	}
	button::before {
		content: "#";
	}
</style>
