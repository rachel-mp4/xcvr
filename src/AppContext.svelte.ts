import { WSContext } from "./Context.svelte";

export class AppContext {
	explainer: boolean = $state(false)
	ctx?: WSContext = $state()
	connectFunc = (port: number) => {
		return () => {
			const scheme = window.location.protocol === "https:" ? "wss" : "ws"
			const s = import.meta.env.DEV ? `${scheme}://localhost:${port}/ws` : `${scheme}://xcvr.chat/${port}/ws`
			this.explainer = false
			this.ctx = new WSContext(s)
		}
	}
}