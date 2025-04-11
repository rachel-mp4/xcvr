import { WSContext } from "./Context.svelte";

export class AppContext {
	explainer: boolean = $state(false)
	ctx?: WSContext = $state()
	connectFunc = (port: number) => {
		return () => {
			const s = import.meta.env.DEV ? `ws://localhost:${port}/ws` : `ws://xcvr.chat/${port}/ws`
			this.explainer = false
			this.ctx = new WSContext(s)
		}
	}
}