import type { Channel } from "./types"

export async function getChannels(): Promise<Channel[]> {
	const url = "http://localhost:8080/xrpc/getChannels"
	try {
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`)
		}
		const json: Channel[] = await response.json()
		return json
	} catch (err: any) {
		throw err
	}
}