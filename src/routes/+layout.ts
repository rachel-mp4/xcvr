import type { LayoutLoad } from "./$types"

export const load: LayoutLoad = async ({ fetch }) => {
	const res = await fetch(`${import.meta.env.VITE_API_URL}/xrpc/getChannels`)
	if (!res.ok) {
		return {
			message: "oopsi",
		}
	}


	const message = await res.json()

	return { message }
}