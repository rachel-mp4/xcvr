import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, fetch }) => {
  const base = import.meta.env.VITE_API_URL
  const endpoint1 = "/xrpc/org.xcvr.actor.resolveChannel"
  const query1 = `?handle=${params.handle}&rkey=${params.rkey}`
  const url1 = `${base}${endpoint1}${query1}`
  const res1 = await fetch(url1)
  if (!res1.ok) {
    return
  }

  const response1 = await res1.json()
  const uri = response1.uri
  const endpoint = "/xrpc/org.xcvr.lrc.getMessages"
  const query = `?channelURI=${uri}`
  const url = `${base}${endpoint}${query}`
  const res = await fetch(url)

  if (!res.ok) {
    return
  }

  const response = await res.json()
  const messages = response.messages
  const cursor = response.cursor
  return {
    messages,
    cursor,
    uri,
  }
}
