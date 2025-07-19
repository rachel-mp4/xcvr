import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, fetch }) => {
  const base = import.meta.env.VITE_API_URL
  const endpoint = "/xrpc/org.xcvr.actor.resolveChannel"
  const query = `?handle=${params.handle}&rkey=${params.rkey}`
  const url = `${base}${endpoint}${query}`
  const res = await fetch(url)

  if (!res.ok) {
    return {
      address: ""
    }
  }

  const channel = await res.json()
  const addrEndpoint = channel.url
  const addrURL = `${base}${addrEndpoint}`
  return {
    address: addrURL,
    uri: channel?.uri
  }
}
