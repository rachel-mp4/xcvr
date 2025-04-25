// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Channel } from "$lib/types/types";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			channels: Array<Channel>
			websocket?: WebSocket
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
