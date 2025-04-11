<script lang="ts">
	import type { AppContext } from "../AppContext.svelte";
	import type { Channel } from "../types";
	interface Props {
		channels: Array<Channel>;
		appctx: AppContext;
	}
	let { channels, appctx }: Props = $props();

	let band = $state("");
	let sign = $state("");
</script>

<div class="channels">
	{#each channels as channel}
		<button onclick={appctx.connectFunc(channel.port)}>
			{channel.band}
		</button>
	{/each}
</div>

<form
	onsubmit={async (e) => {
		e.preventDefault();
		const base = import.meta.env.DEV ? "http://localhost:8080" : "";

		const res = await fetch(`${base}/xrpc/initChannel`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ band, sign, port: 0 }),
		});
		const data = await res.json();
		appctx.connectFunc(data.port)();
	}}
>
	<div>
		<input
			type="text"
			name="band"
			id="band"
			placeholder="enter a frequency band"
			bind:value={band}
			required
		/>
	</div>
	<div>
		<input
			type="text"
			name="sign"
			id="sign"
			bind:value={sign}
			placeholder="enter a call sign"
		/>
	</div>
	<div>
		<input class="form-submit" type="submit" value="create new channel" />
	</div>
</form>

<style>
	.channels {
		display: flex;
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
	form {
		margin-top: 1rem;
		display: inline-block;
		outline: 0.25rem solid black;
	}
	.form-submit {
		background: none;
		cursor: pointer;
		font-weight: 700;
	}
</style>
