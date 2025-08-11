import type { Message, LogItem, SignetView, MessageView } from "./types"
import * as lrc from '@rachel-mp4/lrcproto/gen/ts/lrc'

export class WSContext {
    messages: Array<Message> = $state(new Array())
    orphanedSignets: Map<string, SignetView> = new Map()
    orphanedMessages: Map<string, MessageView> = new Map()
    log: Array<LogItem> = $state(new Array())
    topic: string = $state("")
    connected: boolean = $state(false)
    conncount = $state(0)
    ws: WebSocket | null = null
    ls: WebSocket | null = null
    color: number = $state(Math.floor(Math.random() * 16777216))
    myID: undefined | number
    mySignet: undefined | SignetView
    myNonce: undefined | Uint8Array
    channelUri: string
    curMsg: string = ""
    active: boolean = false
    nick: string = "wanderer"
    handle: string = ""

    constructor(channelUri: string, defaultHandle: string, defaultNick: string, defaultColor: number) {
        console.log(channelUri)
        this.channelUri = channelUri
        this.handle = defaultHandle
        this.nick = defaultNick
        this.color = defaultColor
    }

    connect(url: string) {
        this.ws?.close()
        this.ls?.close()
        connectTo(url, this)
    }

    reconnect = (url: string) => {
        this.ws?.close()
        this.ls?.close()
        connectTo(url, this)
        this.messages = []
        this.orphanedMessages = new Map()
        this.orphanedSignets = new Map()
        this.mySignet = undefined
        this.myID = undefined
        this.myNonce = undefined
    }

    disconnect = () => {
        this.ws?.close()
        this.ws = null
        this.ls?.close()
        this.ls = null
        this.messages = []
        this.orphanedMessages = new Map()
        this.orphanedSignets = new Map()
        this.mySignet = undefined
        this.myID = undefined
        this.myNonce = undefined
    }

    insertLineBreak = () => {
        if (this.active) {
            pubMessage(this)
            const api = import.meta.env.VITE_API_URL
            const record = {
                ...(this.mySignet && { signetURI: this.mySignet.uri }),
                ...(this.channelUri && { channelURI: this.channelUri }),
                ...(this.myID && { messageID: this.myID }),
                ...(this.myNonce && { nonce: b64encodebytearray(this.myNonce) }),
                body: this.curMsg,
                ...(this.nick && { nick: this.nick }),
                ...(this.color && { color: this.color }),
            }
            fetch(`${api}/lrc/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(record),
            }).then((val) => console.log(val), (val) => console.log(val))
            this.active = false
            this.curMsg = ""
            this.mySignet = undefined
            this.myID = undefined
        }
    }

    insert = (idx: number, s: string) => {
        if (!this.active) {
            initMessage(this)
            this.active = true
        }
        insertMessage(idx, s, this)
        this.curMsg = insertSIntoAStringAtIdx(s, this.curMsg, idx)
    }

    delete = (idx: number, idx2: number) => {
        if (!this.active) {
            return
        }
        deleteMessage(idx, idx2, this)
        this.curMsg = deleteFromAStringBetweenIdxs(this.curMsg, idx, idx2)
    }

    setNick = (nick: string) => {
        setNick(nick, this)
    }
    setColor = (color: number) => {
        setColor(color, this)
    }
    setHandle = (handle: string) => {
        setHandle(handle, this)
    }

    setTopic = (topic: string) => {
        console.log("new topic:", topic)
        this.topic = topic
    }

    setConncount = (cc: number) => {
        this.conncount = cc
    }

    // theoretically this could occur _after we have an orphaned signet or an orphanedmessage or both! so,
    // TODO: make it work in that case
    pushMessage = (message: Message) => {
        if (this.messages.length > 200) {
            this.messages = [...this.messages.slice(this.messages.length - 199), message]
        }
        else {
            this.messages.push(message)
        }
    }

    editMessage = (id: number, newMessage: Message) => {
        this.messages = this.messages.map((msg: Message) => {
            return msg.id === id ? newMessage : msg
        })
    }

    pubMessage = (id: number) => {
        this.messages = this.messages.map((msg: Message) => {
            return msg.id === id ? { ...msg, active: false } : msg
        })
    }

    insertMessage = (id: number, idx: number, s: string) => {
        this.messages = this.messages.map((msg: Message) => {
            return msg.id === id ? { ...msg, body: insertSIntoAStringAtIdx(s, msg.body, idx) } : msg
        })
    }

    deleteMessage = (id: number, idx1: number, idx2: number) => {
        this.messages = this.messages.map((msg: Message) => {
            return msg.id === id ? { ...msg, body: deleteFromAStringBetweenIdxs(msg.body, idx1, idx2) } : msg
        })
    }

    addSignet = (signet: SignetView) => {
        if (signet.lrcId === this.myID) {
            this.mySignet = signet
        }
        console.log("now we are signing")
        const arrayIdx = this.messages.findIndex(msg => msg.id === signet.lrcId)
        if (arrayIdx !== -1) {
            console.log("found appropriate signet c:")
            this.messages = this.messages.map((msg: Message) => {
                return msg.id === signet.lrcId ? { ...msg, signetView: signet } : msg
            })
        } else {
            console.log("couldn't find appropriate signet :c")
            const om = this.orphanedMessages.get(signet.uri)
            if (om !== undefined) {
                console.log("some orphan logic")
                const message = makeMessageFromSignetAndMessageViews(om, signet)
                const idx = this.messages.findIndex(msg => msg.id > signet.lrcId)
                if (idx === -1) {
                    this.messages.push(message)
                } else {
                    this.messages = [...this.messages.slice(0, idx), message, ...this.messages.slice(idx)]
                }
                this.orphanedMessages.delete(signet.uri)
            } else {
                this.orphanedSignets.set(signet.uri, signet)
            }
        }
    }

    verifyMessage = (message: MessageView) => {
        console.log("now we are verifying!")
        console.log(message.signetURI)
        const arrayIdx = this.messages.findIndex(msg => msg.signetView?.uri === message.signetURI && msg.signetView?.authorHandle === message.author.handle)
        if (arrayIdx !== -1) {
            console.log("found appropriate message c:")
            this.messages = this.messages.map((msg: Message) => {
                return msg.signetView?.uri === message.signetURI ?
                    makeMessageFromSignetAndMessageViews(message, msg.signetView) : msg
            })
        }
        else {
            console.log("couldn't find appropriate message :c")
            const os = this.orphanedSignets.get(message.signetURI)
            if (os !== undefined) {
                console.log("some orphan logic")
                const m = makeMessageFromSignetAndMessageViews(message, os)
                const idx = this.messages.findIndex(msg => msg.id > os.lrcId)
                if (idx === -1) {
                    this.messages.push(m)
                } else {
                    this.messages = [...this.messages.slice(0, idx), m, ...this.messages.slice(idx)]
                }
                this.orphanedSignets.delete(os.uri)
            } else {
                this.orphanedMessages.set(message.signetURI, message)
            }
        }
    }
    pushToLog = (id: number, ba: Uint8Array, type: string) => {
        const bstring = Array.from(ba).map(byte => byte.toString(16).padStart(2, "0")).join('')
        const time = Date.now()
        this.log = [...this.log.filter(li => li.time > Date.now() - 3000), { id: id, binary: bstring, time: time, type: type, key: Math.random() }]
        console.log(this.log.length)
    }
}

const b64encodebytearray = (u8: Uint8Array): string => {
    return btoa(String.fromCharCode(...u8))
}

const makeMessageFromSignetAndMessageViews = (m: MessageView, s: SignetView): Message => {
    return {
        uri: m.uri,
        body: m.body,
        id: s.lrcId,
        active: false,
        mine: false,
        muted: false,
        ...(m.color && { color: m.color }),
        handle: m.author.handle,
        profileView: m.author,
        signetView: s,
        ...(m.nick && { nick: m.nick }),
        startedAt: s.startedAt
    }
}

const insertSIntoAStringAtIdx = (s: string, a: string, idx: number) => {
    if (idx > a.length) {
        a = a.padEnd(idx)
    }
    return a.slice(0, idx) + s + a.slice(idx)
}

const deleteFromAStringBetweenIdxs = (a: string, idx1: number, idx2: number) => {
    if (idx2 > a.length) {
        a = a.padEnd(idx2)
    }
    return a.slice(0, idx1) + a.slice(idx2)
}

export const connectTo = (url: string, ctx: WSContext) => {
    const ws = new WebSocket(url, "lrc.v1");
    ws.binaryType = "arraybuffer";
    ws.onopen = () => {
        console.log("connected")
        ctx.connected = true
        getTopic(ctx)
        setNick(ctx.nick, ctx)
        setColor(ctx.color, ctx)
        setHandle(ctx.handle, ctx)
    };
    ws.onmessage = (event) => {
        console.log(event)
        parseEvent(event, ctx)
        // if (shouldScroll) {
        //     setTimeout(() => {
        //         window.scrollTo(0, document.body.scrollHeight)
        //     }, 0)
        // }

    };
    ws.onclose = () => {
        console.log("closed")
        if (ws === ctx.ws) {
            ctx.connected = false
        }
    };
    ws.onerror = (event) => {
        console.log("errored:", event)
        console.log("readyState:", ws.readyState)
        if (ws === ctx.ws) {
            ctx.connected = false
        }
    }
    ctx.ws = ws
    const lsURI = `${import.meta.env.VITE_API_URL}/xrpc/org.xcvr.lrc.subscribeLexStream?uri=${ctx.channelUri}`
    const ls = new WebSocket(lsURI)
    ls.onmessage = (event) => {
        console.log("recieved lexicon event:", event)
        parseLexStreamEvent(event, ctx)
    }
    ls.onclose = () => {
        console.log("closed ls")
    }
    ls.onerror = (event) => {
        console.log("errored:", event)
    }
    ctx.ls = ls
}

const parseLexStreamEvent = (event: MessageEvent<any>, ctx: WSContext) => {
    console.log("parsing!!!!")
    const lex = JSON.parse(event.data)
    console.log(lex.$type)
    switch (lex.$type) {
        case "org.xcvr.lrc.defs#signetView": {
            console.log("parsing signet!!!")
            const uri = lex.uri
            const issuerHandle = lex.issuerHandle
            const channelURI = lex.channelURI
            const lrcID = lex.lrcID
            const authorHandle = lex.authorHandle
            const startedAt = Date.parse(lex.startedAt)
            ctx.addSignet({
                $type: "org.xcvr.lrc.defs#signetView",
                uri: uri,
                issuerHandle: issuerHandle,
                channelURI: channelURI,
                lrcId: lrcID,
                authorHandle: authorHandle,
                startedAt: startedAt
            })
            return
        }
        case "org.xcvr.lrc.defs#messageView": {
            console.log("parsing message!!!")
            const uri = lex.uri
            const author = {
                did: lex.author.did,
                handle: lex.author.handle,
                ...(lex.author.displayName && { displayName: lex.author.displayName }),
                ...(lex.author.status && { status: lex.author.status }),
                ...(lex.author.color && { color: lex.author.color }),
                ...(lex.author.avatar && { avatar: lex.author.avatar }),
            }
            const body = lex.body
            const nick = lex.nick
            const color = lex.color
            const signetURI = lex.signetURI
            const postedAt = lex.postedAt
            ctx.verifyMessage({
                uri: uri,
                author: author,
                body: body,
                ...(nick && { nick: nick }),
                ...(color && { color: color }),
                ...(signetURI && { signetURI: signetURI }),
                ...(postedAt && { postedAt: postedAt }),
            })
            return
        }
    }
}

export const initMessage = (ctx: WSContext) => {
    const evt: lrc.Event = {
        msg: {
            oneofKind: "init",
            init: {
                nick: ctx.nick,
                color: ctx.color,
                externalID: ctx.handle
            }
        }
    }
    const byteArray = lrc.Event.toBinary(evt)
    ctx.ws?.send(byteArray)
}

export const insertMessage = (idx: number, s: string, ctx: WSContext) => {
    const evt: lrc.Event = {
        msg: {
            oneofKind: "insert",
            insert: {
                utf16Index: idx,
                body: s
            }
        }
    }
    const byteArray = lrc.Event.toBinary(evt)
    ctx.ws?.send(byteArray)
}

export const pubMessage = (ctx: WSContext) => {
    const evt: lrc.Event = {
        msg: {
            oneofKind: "pub",
            pub: {
            }
        }
    }
    const byteArray = lrc.Event.toBinary(evt)
    ctx.ws?.send(byteArray)
}

export const deleteMessage = (idx: number, idx2: number, ctx: WSContext) => {
    const evt: lrc.Event = {
        msg: {
            oneofKind: "delete",
            delete: {
                utf16Start: idx,
                utf16End: idx2
            }
        }
    }
    const byteArray = lrc.Event.toBinary(evt)
    ctx.ws?.send(byteArray)
}

export const getTopic = (ctx: WSContext) => {
    const evt: lrc.Event = {
        msg: {
            oneofKind: "get",
            get: {
                topic: "_"
            }
        }
    }
    const byteArray = lrc.Event.toBinary(evt)
    ctx.ws?.send(byteArray)
}

export const setNick = (nick: string, ctx: WSContext) => {
    ctx.nick = nick
    const evt: lrc.Event = {
        msg: {
            oneofKind: "set",
            set: {
                nick: nick
            }
        }
    }
    const byteArray = lrc.Event.toBinary(evt)
    ctx.ws?.send(byteArray)
}

export const setHandle = (handle: string, ctx: WSContext) => {
    ctx.handle = handle
    const evt: lrc.Event = {
        msg: {
            oneofKind: "set",
            set: {
                externalID: handle
            }
        }
    }
    const byteArray = lrc.Event.toBinary(evt)
    ctx.ws?.send(byteArray)
}
export const setColor = (color: number, ctx: WSContext) => {
    ctx.color = color
    const evt: lrc.Event = {
        msg: {
            oneofKind: "set",
            set: {
                color: color
            }
        }
    }
    const byteArray = lrc.Event.toBinary(evt)
    ctx.ws?.send(byteArray)
}

function parseEvent(binary: MessageEvent<any>, ctx: WSContext): boolean {
    const byteArray = new Uint8Array(binary.data);
    const event = lrc.Event.fromBinary(byteArray)
    switch (event.msg.oneofKind) {
        case "ping": {
            return false;
        }

        case "pong": {
            return false
        }

        case "init": {
            console.log(event.msg.init)
            const id = event.msg.init.id ?? 0
            if (id === 0) return false
            const echoed = event.msg.init.echoed ?? false
            if (echoed) {
                ctx.myID = id
                ctx.myNonce = event.msg.init.nonce
                // return false
            }
            const nick = event.msg.init.nick
            const handle = event.msg.init.externalID
            const color = event.msg.init.color
            const body = ""
            const active = true
            const mine = echoed
            const muted = false
            const startedAt = Date.now()
            const msg = {
                body: body,
                id: id,
                active: active,
                mine: mine,
                muted: muted,
                ...(color && { color: color }),
                ...(handle && { handle: handle }),
                ...(nick && { nick: nick }),
                startedAt: startedAt
            }
            ctx.pushMessage(msg)
            ctx.pushToLog(id, byteArray, "init")
            return true
        }

        case "pub": {
            const id = event.msg.pub.id ?? 0
            if (id === 0) return false
            ctx.pubMessage(id)
            ctx.pushToLog(id, byteArray, "pub")
            return false
        }

        case "insert": {
            const id = event.msg.insert.id ?? 0
            if (id === 0) return false
            const idx = event.msg.insert.utf16Index
            const s = event.msg.insert.body
            ctx.insertMessage(id, idx, s)
            ctx.pushToLog(id, byteArray, "insert")
            return false
        }

        case "delete": {
            const id = event.msg.delete.id ?? 0
            if (id === 0) return false
            const idx = event.msg.delete.utf16Start
            const idx2 = event.msg.delete.utf16End
            ctx.deleteMessage(id, idx, idx2)
            ctx.pushToLog(id, byteArray, "delete")
            return false
        }


        case "mute": {
            const id = event.msg.mute.id ?? 0
            if (id === 0) return false
            const nick = ""
            const muted = true
            const active = false
            const mine = false
            const color = 0
            const handle = ""
            const body = ""
            const startedAt = Date.now()
            ctx.pushMessage({ id, body, nick, muted, active, mine, color, handle, startedAt })
        }

        case "unmute": {
            return false
        }

        case "set": {
            return false
        }

        case "get": {
            if (event.msg.get.connected !== undefined) {
                ctx.setConncount(event.msg.get.connected)
            }
            if (event.msg.get.topic !== undefined) {
                ctx.setTopic(event.msg.get.topic)
            }
        }

    }
    return false
}

