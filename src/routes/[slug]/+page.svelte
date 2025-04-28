<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import type { PageProps } from "./$types";
	import { WSContext } from "$lib/wscontext.svelte";
	import Transmitter from "$lib/components/Transmitter.svelte";
	import Receiever from "$lib/components/Receiever.svelte";
    import { afterNavigate } from "$app/navigation";
	let { data }: PageProps = $props();

	let wsctx: WSContext | undefined = $state()
	const resetctx = () => {
		wsctx?.disconnect()
		const scheme = window.location.protocol === "https:" ? "wss" : "ws";
		const s = import.meta.env.DEV
			? `${scheme}://localhost:8080/${data.slug}/ws`
			: `${scheme}://xcvr.chat/${data.slug}/ws`;
		wsctx = new WSContext(s);
	}
	onMount(resetctx)
	afterNavigate(resetctx)
	onDestroy(() => {
		wsctx?.disconnect();
	});
</script>

<div>
	hi {data.slug}
</div>
{#if wsctx}
	<Receiever messages={wsctx.messages} />
	<Transmitter ctx={wsctx} />
{/if}
