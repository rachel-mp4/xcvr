import type { Message, LogItem } from "./types"
import * as lrc from '@rachel-mp4/lrcproto/gen/ts/lrc'

export class WSContext {
    messages: Array<Message> = $state(new Array())
    log: Array<LogItem> = $state(new Array())
    topic: string = $state("")
    connected: boolean = $state(false)
    conncount = $state(0)
    ws: WebSocket | null = null
    ls: WebSocket | null = null
    color: number = $state(Math.floor(Math.random() * 16777216))
    myID: undefined | number
    mySignetUri: undefined | string
    channelUri: string
    curMsg: string = ""
    active: boolean = false
    nick: string = "wanderer"
    handle: string = ""

    constructor(channelUri: string, defaultNick: string, defaultColor: number) {
        this.channelUri = channelUri
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
    }

    disconnect = () => {
        this.ws?.close()
        this.ls?.close()
    }

    insertLineBreak = () => {
        if (this.active) {
            pubMessage(this)
            const api = import.meta.env.VITE_API_URL
            let record
            if (this.mySignetUri !== undefined) {
                record = {
                    signetURI: this.mySignetUri,
                    body: this.curMsg,
                    nick: this.nick,
                    color: this.color
                }
            } else {
                record = {
                    channelURI: this.channelUri,
                    messageID: this.myID,
                    body: this.curMsg,
                    color: this.color,
                    nick: this.nick
                }
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

    setTopic = (topic: string) => {
        console.log("new topic:", topic)
        this.topic = topic
    }

    setConncount = (cc: number) => {
        this.conncount = cc
    }

    pushMessage = (message: Message) => {
        this.messages.push(message)
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
        setNick("wanderer", ctx)
        setColor(255, ctx)
        setHandle("beep.boop", ctx)
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
    const lsURI = `${import.meta.env.BASE_URL}/xrpc/org.xcvr.lrc.subscribeLexStream?uri=${ctx.channelUri}`
    const ls = new WebSocket(lsURI)
    ls.onmessage = (event) => {
        console.log(event)
    }
    ls.onclose = () => {
        console.log("closed ls")
    }
    ls.onerror = (event) => {
        console.log("errored:", event)
    }
    ctx.ls = ls
}

const parseLexStreamEvent = (event: MessageEvent<any>) => {

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
            const id = event.msg.init.id ?? 0
            if (id === 0) return false
            const echoed = event.msg.init.echoed ?? false
            // if (echoed) return false
            const nick = event.msg.init.nick ?? "wanderer"
            const handle = event.msg.init.externalID ?? ""
            const color = event.msg.init.color ?? 12529712
            const body = ""
            const active = true
            const mine = echoed
            const muted = false
            const startedAt = Date.now()
            const msg = { id, active, mine, muted, body, nick, handle, color, startedAt }
            ctx.pushMessage(msg)
            // const bstring = btoa(Array.from(byteArray).map(byte => String.fromCharCode(byte)).join(''))
            // ctx.log.push({event:event, binary: bstring, color:"init"})
            return true
        }

        case "pub": {
            const id = event.msg.pub.id ?? 0
            if (id === 0) return false
            ctx.pubMessage(id)
            // const bstring = btoa(Array.from(byteArray).map(byte => String.fromCharCode(byte)).join(''))
            // ctx.log.push({event:event, binary: bstring, color:"pub"})
            return false
        }

        case "insert": {
            const id = event.msg.insert.id ?? 0
            if (id === 0) return false
            const idx = event.msg.insert.utf16Index
            const s = event.msg.insert.body
            ctx.insertMessage(id, idx, s)
            // const bstring = btoa(Array.from(byteArray).map(byte => String.fromCharCode(byte)).join(''))
            // ctx.log.push({event:event, binary: bstring, color:"insert"})
            return false
        }

        case "delete": {
            const id = event.msg.delete.id ?? 0
            if (id === 0) return false
            const idx = event.msg.delete.utf16Start
            const idx2 = event.msg.delete.utf16End
            ctx.deleteMessage(id, idx, idx2)
            // const bstring = btoa(Array.from(byteArray).map(byte => String.fromCharCode(byte)).join(''))
            // ctx.log.push({event:event, binary: bstring, color:"delete"})
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
