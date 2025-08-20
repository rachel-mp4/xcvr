import type { ChannelView } from "$lib/types.ts"
import type { SignedMessageView, Message } from "$lib/types.ts"
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

export function calculateMarginTop(
  currentTime: number | null,
  previousTime: number | null,
) {
  if (!previousTime || !currentTime) return 0;
  const elapsedMs = currentTime - previousTime;
  const elapsedMinutes = elapsedMs / (1000 * 60);
  return Math.log(elapsedMinutes + 1);
}

export function signedMessageViewToMessage(sm: SignedMessageView): Message {
  return {
    uri: sm.uri,
    body: sm.body,
    id: sm.signet.lrcId,
    active: false,
    mine: false,
    muted: false,
    ...(sm.color && { color: sm.color }),
    handle: sm.author.handle,
    profileView: sm.author,
    signetView: sm.signet,
    ...(sm.nick && { nick: sm.nick }),
    startedAt: sm.signet.startedAt,
  }
}
export function sanitizeHandle(input: string) {
  return input
    .normalize('NFKC') // Unicode normalization
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Control characters
    .replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F]/g, '') // Invisible/directional
    .replace(/[\uFEFF]/g, '') // Byte order mark
    .trim();
}
