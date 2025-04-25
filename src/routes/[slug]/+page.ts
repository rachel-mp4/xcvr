import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
	const scheme = window.location.protocol === "https:" ? "wss" : "ws"
	const s = import.meta.env.DEV ? `${scheme}://localhost:8080/${params.slug}/ws` : `${scheme}://xcvr.chat/8080/ws`
	const ws = new WebSocket(s)

	ws.binaryType = "arraybuffer"
	ws.onopen = () => {
		console.log("yay!")
	}
	ws.onmessage = () => {
		console.log("beeep")
		// const shouldScroll = parseEvent(event, ctx);
		// if (shouldScroll) {
		//     setTimeout(() => {
		//         window.scrollTo(0, document.body.scrollHeight)
		//     }, 0)
		// }

	}
	ws.onclose = () => {
		console.log("closed")
	}
	ws.onerror = () => {
		console.log("errored")
	}
	return { websocket: ws }
}