import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, fetch }) => {
  const base = import.meta.env.VITE_API_URL
  const endpoint = "/xrpc/org.xcvr.lrc.getMessages"
  const uri = `at://${params.handle}/org.xcvr.feed.channel/${params.rkey}`
  const query = `?channelURI=${uri}`
  const url = `${base}${endpoint}${query}`
  const res = await fetch(url)

  if (!res.ok) {
    return {
      messages: ""
    }
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
