import type { LayoutLoad } from "./$types"

export const load: LayoutLoad = async ({ fetch }) => {
	const results = await Promise.allSettled([
		fetch(`${import.meta.env.VITE_API_URL}/xrpc/org.xcvr.feed.getChannels`)
			.then(r => r.json()),
		fetch(`${import.meta.env.VITE_API_URL}/oauth/whoami`)
			.then(r => r.json())
	])
	return {
		channels: results[0].status === 'fulfilled' ? results[0].value : [],
		id: results[1].status === 'fulfilled' ? results[1].value : null
	}
}
