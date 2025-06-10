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
    body: string
    id: number
    active: boolean
    mine: boolean
    muted: boolean
    color: number 
    did: string
    profileview?: string
    nick: string
}

export type LogItem = {
    event: lrc.Event
    binary: string
    color: string
}
