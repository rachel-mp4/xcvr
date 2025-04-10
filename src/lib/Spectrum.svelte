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
		<button
			onclick={appctx.connectFunc(
				`ws://localhost:${channel.port}/${channel.band}/ws`,
			)}
		>
			{channel.band}
		</button>
	{/each}
</div>

<form
	onsubmit={async (e) => {
		e.preventDefault();
		const res = await fetch("http://localhost:8080/xrpc/initChannel", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ band, sign, port: 0 }),
		});
		const data = await res.json();
		appctx.connectFunc(`ws://localhost:${data.port}/${data.band}/ws`)();
	}}
>
	<div>
		<input
			type="text"
			name="band"
			id="band"
			placeholder="enter a band"
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
		padding:0;
		margin: 0;
		background: none;
		border: none;
		cursor: pointer;
		font-weight: 700;
	}
	button::before {
		content:"#";
	}
	ul {
		margin-block: 0rem;
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
