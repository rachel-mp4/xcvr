import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageLoad = async ({ params, fetch }) => {
  const base = import.meta.env.VITE_API_URL

  if (!base || !params.handle || !params.rkey) {
    throw error(400, 'Missing required parameters')
  }

  try {
    // Resolve channel
    const channelRes = await fetch(`${base}/xrpc/org.xcvr.actor.resolveChannel?handle=${params.handle}&rkey=${params.rkey}`)
    if (!channelRes.ok) throw error(channelRes.status, 'Channel not found')

    const { uri } = await channelRes.json()
    if (!uri) throw error(500, 'Invalid channel response')

    // Get messages
    const historyRes = await fetch(`${base}/xrpc/org.xcvr.lrc.getHistory?channelURI=${uri}`)
    if (!historyRes.ok) throw error(historyRes.status, 'Failed to load messages')

    const { items = [], cursor } = await historyRes.json()

    return { items, cursor, uri }

  } catch (err) {
    throw error(500, 'Unexpected error')
  }
}

