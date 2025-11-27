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

export type Item = Message | Media | Enby

export type Enby = {
    type: 'enby'
    id: number
    lrcdata: LrcBaseItem
    signetView?: SignetView
}

export type Message = {
    type: 'message'
    id: number
    lrcdata: LrcMessage
    messageView?: MessageView
    signetView?: SignetView
}

export type Media = Image

export type Image = {
    type: 'image'
    id: number
    lrcdata: LrcMedia
    mediaView?: MediaView
    signetView?: SignetView
}

export type LrcMessage = LrcBaseItem & {
    body: string
    pub?: LrcMessagePub
}

export type LrcMedia = LrcBaseItem & {
    pub?: LrcMediaPub
}

export type LrcBaseItem = {
    mine: boolean
    muted: boolean
    init?: LrcInit
}

export type LrcInit = {
    color?: number
    nick?: string
    handle?: string
    nonce?: Uint8Array
}

export type LrcMediaPub = {
    alt: string
    contentAddress?: string
}

export type LrcMessagePub = boolean

export type AspectRatio = {
    width: number
    height: number
}

export function isEnby(item: Item): item is Enby {
    return item.type === "enby"
}

export function isMessage(item: Item): item is Message {
    return item.type === 'message' || item.type === 'enby'
}

export function isImage(item: Item): item is Image {
    return item.type === 'image' || item.type === 'enby'
}

export function isMedia(item: Item): item is Media {
    return isImage(item)
}

export type AtpBlob = {
    $type: string
    ref: {
        $link: string
    }
    mimeType: string
    size: number
}

export type AtpImage = {
    $type: string
    alt: string
    aspectRatio?: ATPAspectRatio
    blob?: AtpBlob
}

export type ATPAspectRatio = {
    width: number
    height: number
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
    issuer: string
    channelURI: string
    lrcId: number
    author: string
    authorHandle?: string
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
    postedAt: string
}

export type ItemView = MessageView | MediaView

export type ImageView = {
    $type?: string
    alt: string
    src?: string
    aspectRatio?: AspectRatio
}

export type SignedItemView = SignedMessageView | SignedMediaView

export type SignedMessageView = {
    type: 'message'
    $type?: string
    uri: string
    author: ProfileView
    body: string
    nick?: string
    color?: number
    signet: SignetView
    postedAt: string
}

export type SignedMediaView = SignedImageView

export type SignedImageView = {
    type: 'image'
    $type?: string
    uri: string
    author: ProfileView
    imageView: ImageView
    nick?: string
    color?: number
    signet: SignetView
    postedAt: string
}
