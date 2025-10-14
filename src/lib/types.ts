import * as lrc from '@rachel-mp4/lrcproto'
export type Channel = {
    title: string
    host: string
    topic?: string
}

export type ChannelView = {
    $type?: string
    uri: string
    host: string
    creator: ProfileView
    title: string
    topic?: string
    connectedCount?: number
    createdAt?: string
}

export type ProfileView = {
    $type?: string
    did: string
    handle: string
    displayName?: string
    status?: string
    color?: number
    avatar?: string
}

type BaseItem = {
    uri?: string
    id: number
    active: boolean
    mine: boolean
    muted: boolean
    color?: number
    handle?: string
    profileView?: ProfileView
    signetView?: SignetView
    nick?: string
    startedAt: number
}

export type AspectRatio = {
    width: number
    height: number
}

export type Image = BaseItem & {
    type: 'image'
    alt?: string
    malt?: string
    src?: string
    msrc?: string
    aspectRatio?: AspectRatio
    maspectRatio?: AspectRatio
}

export type Message = BaseItem & {
    type: 'message'
    body: string
    mbody?: string
}
export type Item = Message | Image

export function isMessage(item: Item): item is Message {
    return item.type === 'message'
}

export function isImage(item: Item): item is Image {
    return item.type === 'image'
}

export type LogItem = {
    id: number
    binary: string
    time: number
    type: string
    key: number
}

export type SignetView = {
    $type?: string
    uri: string
    issuerHandle: string
    channelURI: string
    lrcId: number
    authorHandle: string
    startedAt: string
}

export type MessageView = {
    $type?: string
    uri: string
    author: ProfileView
    body: string
    nick?: string
    color?: number
    signetURI: string
    postedAt: string
}

export type MediaView = {
    $type?: string
    uri: string
    author: ProfileView
    imageView?: ImageView
    nick?: string
    color?: number
    signetURI: string
}

export type ImageView = {
    $type?: string
    alt: string
    src?: string
    aspectRatio?: AspectRatio
}

export type SignedMessageView = {
    $type?: string
    uri: string
    author: ProfileView
    body: string
    nick?: string
    color?: number
    signet: SignetView
    postedAt: string
}
