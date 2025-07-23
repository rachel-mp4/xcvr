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
		myProfile: results[1].status === 'fulfilled' ? { ...(results[1].value), loggedIn: true } : {
			handle: "xcvr.org",
			defaultNick: "wanderer",
			color: 3702605,
			loggedIn: false,
		}
	}
}
