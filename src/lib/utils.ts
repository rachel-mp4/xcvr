import type { ChannelView } from "$lib/types.ts"
import type { SignedImageView, SignedMessageView, Message, Image } from "$lib/types.ts"
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

export function signedImageViewToImage(sm: SignedImageView): Image {
  return {
    type: 'image',
    id: sm.signet.lrcId,
    lrcdata: {
      muted: false,
      mine: false
    },
    signetView: sm.signet,
    mediaView: {
      $type: sm.$type,
      uri: sm.uri,
      author: sm.author,
      imageView: sm.imageView,
      ...(sm.nick && { nick: sm.nick }),
      ...(sm.color && { color: sm.color }),
      signetURI: sm.signet.uri,
      postedAt: sm.postedAt
    }
  }
}

export function signedMessageViewToMessage(sm: SignedMessageView): Message {
  return {
    type: 'message',
    id: sm.signet.lrcId,
    lrcdata: {
      body: "",
      muted: false,
      mine: false
    },
    signetView: sm.signet,
    messageView: {
      $type: sm.$type,
      uri: sm.uri,
      author: sm.author,
      body: sm.body,
      ...(sm.nick && { nick: sm.nick }),
      ...(sm.color && { color: sm.color }),
      signetURI: sm.signet.uri,
      postedAt: sm.postedAt
    }
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

export function smartAbsoluteTimestamp(then: number): string {
  const now = Date.now()
  try {
    if (then > now) {
      return "in the future"
    } else if (now - then < 1000 * 60 * 60 * 18) {
      const formatter = new Intl.DateTimeFormat("en-us", { hour: "numeric", minute: "numeric" })
      return formatter.format(then).toLocaleLowerCase()
    } else if (now - then < 1000 * 60 * 60 * 24 * 6) {
      const formatter = new Intl.DateTimeFormat("en-us", { weekday: "long", dayPeriod: "long" })
      return formatter.format(then).toLocaleLowerCase()
    } else if (now - then < 1000 * 60 * 60 * 24 * 333) {
      const formatter1 = new Intl.DateTimeFormat("en-us", { weekday: "long" })
      const formatter2 = new Intl.DateTimeFormat("en-us", { month: "long" })
      const formatter3 = new Intl.DateTimeFormat("en-us", { dayPeriod: "long" })
      return `a ${formatter1.format(then)} in ${formatter2.format(then)} ${formatter3.format(then)}`.toLocaleLowerCase()
    } else {
      const formatter1 = new Intl.DateTimeFormat("en-us", { weekday: "long" })
      const formatter2 = new Intl.DateTimeFormat("en-us", { month: "long" })
      const formatter3 = new Intl.DateTimeFormat("en-us", { year: "numeric", dayPeriod: "long" })
      return `a ${formatter1.format(then)} in ${formatter2.format(then)} ${formatter3.format(then)}`.toLocaleLowerCase()
    }
  } catch {
    return `sometime who cares`
  }
}

export function dumbAbsoluteTimestamp(then: number): string {
  return (new Date(then)).toString()
}
