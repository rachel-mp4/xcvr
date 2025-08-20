import type { LayoutLoad } from "./$types"

export const load: LayoutLoad = async ({ fetch }) => {
	const results = await Promise.allSettled([
		fetch(`${import.meta.env.VITE_API_URL}/xrpc/org.xcvr.feed.getChannels`)
			.then(r => r.ok ? r.json() : []),
		fetch(`${import.meta.env.VITE_API_URL}/oauth/whoami`)
			.then(r => r.ok ? r.json() : null)
	])
	return {
		channels: results[0].status === 'fulfilled' ? results[0].value : [],
		myProfile: results[1].status === 'fulfilled' && results[1].value !== null ? { ...(results[1].value), loggedIn: true } : {
			handle: "xcvr.org",
			defaultNick: "wanderer",
			color: Math.floor(Math.random() * 16777216),
			loggedIn: false,
		}
	}
}
