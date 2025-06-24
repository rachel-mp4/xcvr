import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, fetch }) => {
  const base = import.meta.env.VITE_API_URL
  const endpoint = "/xrpc/org.xcvr.actor.getProfileView"
  const query = `?handle=${params.handle}`
  const url = `${base}${endpoint}${query}`
  const res = await fetch(url)

  if (!res.ok) {
    return {
      profile: null
    }
  }

  const profile = await res.json()
  console.log(profile)
  return {
    profile: profile
  }
}
