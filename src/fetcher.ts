import type { Channel } from "./types"

const base = import.meta.env.DEV ? "http://localhost:8080" : ""

export async function getChannels(): Promise<Channel[]> {
	const url = `${base}/xrpc/getChannels`
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