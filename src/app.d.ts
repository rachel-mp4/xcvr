// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Channel } from "$lib/types";
import { WSContext } from "$lib/wscontext.svelte";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			channels: Array<Channel>
			slug: string
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
