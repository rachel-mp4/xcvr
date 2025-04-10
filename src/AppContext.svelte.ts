import { WSContext } from "./Context.svelte";

export class AppContext {
	explainer: boolean = $state(false)
	ctx?: WSContext = $state()
	connectFunc = (s: string) => {
		return () => {
			this.explainer = false
			this.ctx = new WSContext(s)
		}
	}
}