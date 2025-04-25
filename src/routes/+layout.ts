import type { LayoutLoad } from "./$types"

export const load: LayoutLoad = async ({ fetch }) => {
	const res = await fetch(`${import.meta.env.VITE_API_URL}/xrpc/getChannels`)
	if (!res.ok) {
		return {
			channels: [],
		}
	}


	const channels = await res.json()

	return { channels }
}