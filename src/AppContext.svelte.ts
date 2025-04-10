import { WSContext } from "./Context.svelte";

export class AppContext {
	ctx?: WSContext = $state()
	connectFunc = (s: string) => {
		return () => {
			this.ctx = new WSContext(s)
		}
	}
}