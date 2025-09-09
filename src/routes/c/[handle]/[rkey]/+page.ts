import type { PageLoad } from './$types'
export const trailingSlash = 'always'

export const load: PageLoad = async ({ params, fetch }) => {
  const base = import.meta.env.VITE_API_URL
  const channelEndpoint = "/xrpc/org.xcvr.actor.resolveChannel"
  const channelViewEndpoint = "/xrpc/org.xcvr.feed.getChannel"
  const query = `?handle=${params.handle}&rkey=${params.rkey}`
  const fetchSafely = async (url: string) => {
    try {
      const res = await fetch(url)
      return res.ok ? await res.json() : null
    } catch {
      return null
    }
  }

  const [channel, channelView] = await Promise.allSettled([
    fetchSafely(`${base}${channelEndpoint}${query}`),
    fetchSafely(`${base}${channelViewEndpoint}${query}`)
  ]).then(results =>
    results.map(result =>
      result.status === 'fulfilled' ? result.value : null
    )
  )


  const addrEndpoint = channel.url
  const addrURL = `${base}${addrEndpoint}`
  return {
    address: addrURL,
    uri: channel?.uri,
    channelView: channelView
  }
}
