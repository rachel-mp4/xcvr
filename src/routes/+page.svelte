<svelte:head>
	<title>xcvr</title>
</svelte:head>
<main class="fp-blurb">
	<h1>welcome to xcvr</h1>
	<p>
		xcvr (transceiver) is a web implementation of the LRC protocol. Where most
		text-based communication that occurs on the web is like mail—I compose my
		message, then I proofread it, then I send it to a correspondent who then has
		a permanent record of it—LRC is more like radio—I transmit my message as I
		compose it & anyone who is tuned into my band recieves an ephemeral signal.
	</p>
	<p>click on a channel to the left to get started.</p>
</main>
<aside>
	<a href="/settings"> adjust settings </a>
</aside>

<style>
	h1 {
		position: relative;
		font-size: 4rem;
		font-weight: normal;
		display: inline-block;
	}
	p:not(:first-of-type) {
		margin-top: 1rem;
	}
	h1::before {
		content: "";
		position: absolute;
		z-index: -1;
		left: 0rem;
		right: 0rem;
		top: 3rem;
		bottom: 0.375rem;
		background-image: linear-gradient(
			90deg,
			#034732ff,
			#034732ee 40%,
			#008148dd 40%,
			#008148cc 70%,
			#c6c013bb 70%,
			#c6c013aa 90%,
			#ef8a1799 90%,
			#ef8a1788
		);
	}
</style>
