import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, fetch }) => {
  const base = import.meta.env.VITE_API_URL
  const query = `?handle=${params.handle}`

  const fetchSafely = async (url: string) => {
    try {
      const res = await fetch(url)
      return res.ok ? await res.json() : null
    } catch {
      return null
    }
  }

  const [profile, lastSeen] = await Promise.allSettled([
    fetchSafely(`${base}/xrpc/org.xcvr.actor.getProfileView${query}`),
    fetchSafely(`${base}/xrpc/org.xcvr.actor.getLastSeen${query}`)
  ]).then(results =>
    results.map(result =>
      result.status === 'fulfilled' ? result.value : null
    )
  )

  return {
    profile,
    lastSeen
  }
}
