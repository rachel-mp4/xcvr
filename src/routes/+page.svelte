<script lang="ts">
	let band = $state("");
	let sign = $state("");
</script>

<svelte:head>
	<title>xcvr</title>
</svelte:head>
<div class="fp-blurb">
	<h1>welcome to xcvr</h1>
	<p>
		xcvr (transceiver) is a web implementation of the LRC protocol. Where
		most text-based communication that occurs on the web is like mail—I
		compose my message, then I proofread it, then I send it to a
		correspondent who then has a permanent record of it—LRC is more like
		radio—I transmit my message as I compose it & anyone who is tuned into
		my band recieves an ephemeral signal.
	</p>
	<p>click on a channel to the left to get started.</p>
	<p>or create your own:</p>

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
			<input
				class="form-submit"
				type="submit"
				value="create new channel"
			/>
		</div>
	</form>
</div>

<style>
	.fp-blurb {
		max-width: 40rem
	}
</style>