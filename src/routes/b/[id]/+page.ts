import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, fetch }) => {
  const base = import.meta.env.VITE_API_URL
  const query = `?id=${params.id}`

  const fetchSafely = async (url: string) => {
    try {
      const res = await fetch(url)
      return res.ok ? await res.json() : null
    } catch {
      return null
    }
  }

  const [ban] = await Promise.allSettled([
    fetchSafely(`${base}/oauth/ban${query}`),
  ]).then(results =>
    results.map(result =>
      result.status === 'fulfilled' ? result.value : null
    )
  )

  return {
    ban,
  }
}
