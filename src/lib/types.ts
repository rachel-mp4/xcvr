import * as lrc from '@rachel-mp4/lrcproto'
export type Channel = {
    title: string
    host: string
    topic?: string
}

export type ChannelView = {
    uri: string
    host: string
    creator: ProfileView
    title: string
    topic?: string
    connectedCount?: number
    createdAt?: string
}

export type ProfileView = {
    did: string
    handle: string
    displayName?: string
    status?: string
    color?: number
    avatar?: string
}

export type Message = {
    uri?: string
    body: string
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

export type LogItem = {
    event: lrc.Event
    binary: string
    color: string
}

export type SignetView = {
    uri: string
    issuerHandle: string
    channelURI: string
    lrcId: number
    authorHandle: string
    startedAt: number
}

export type MessageView = {
    uri: string
    author: ProfileView
    body: string
    nick?: string
    color?: number
    signetUri: string
    postedAt: string
}
