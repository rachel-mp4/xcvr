import type { ChannelView } from "$lib/types.ts"
export function getChannelWS(c: ChannelView): string | null {
  const host = c.host
  const uri = c.uri
  let rkey = getRkeyFromUri(uri)
  if (rkey == null) {
    return null
  }
  return `wss://${host}/lrc/${rkey}/ws`

}

export function getChannelUrl(c: ChannelView): string | null {
  const handle = c.creator.handle
  const rkey = getRkeyFromUri(c.uri)
  if (rkey == null) {
    return null
  }
  return `/c/${handle}/${rkey}`
}

export function getChannelDeleteUrl(c: ChannelView): string | null {
  const host = c.host
  const uri = c.uri
  let rkey = getRkeyFromUri(uri)
  if (rkey == null) {
    return null
  }
  return `https://${host}/lrc/${c.creator.did}/${rkey}/ws`
}

export function getRkeyFromUri(uri: string): string | null {
  const matched = uri.match(/^at:\/\/[^/]+\/[^/]+\/([^/]+)$/)
  return matched ? matched[1] : null
}

const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' })

export function getNextCharBoundary(text: string, position: number) {
  if (position >= text.length) return position;
  const segments = Array.from(segmenter.segment(text.slice(position)));
  return segments.length > 0 ? position + segments[0].segment.length : position;
}

export function getPrevCharBoundary(text: string, position: number) {
  if (position <= 0) return 0;
  const segments = Array.from(segmenter.segment(text.slice(0, position)));
  return segments.length > 0 ? position - segments[segments.length - 1].segment.length : 0;
}
