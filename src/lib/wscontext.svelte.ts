import type { Message, LogItem } from "./types"
import * as lrc from '@rachel-mp4/lrcproto/gen/ts/lrc'

export class WSContext {
    messages: Array<Message> = $state(new Array())
    log: Array<LogItem> = $state(new Array())
    topic: string = $state("")
    connected: boolean = $state(false)
    conncount = $state(0)
    ws: WebSocket | null = null
    color: number = $state(Math.floor(Math.random() * 16777216))
    curMsg: string = ""
    active: boolean = false
    nick: string = "wanderer"
    did: string = ""

    constructor() {
    }

    connect(url: string) {
        this.ws?.close()
        this.ws = connectTo(url, this)
    }

    reconnect = (url: string) => {
        this.ws?.close()
        this.ws = connectTo(url, this)
    }

    disconnect = () => {
        this.ws?.close()
    }

    insertLineBreak = () => {
        if (this.active) {
            pubMessage(this)
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
        this.curMsg = this.curMsg.slice(0, idx) + s + this.curMsg.slice(idx)
    }

    delete = (idx: number, idx2: number) => {
        if (!this.active) {
            return
        }
        deleteMessage(idx, idx2, this)
        this.curMsg = this.curMsg.slice(0, idx - 1) + this.curMsg.slice(idx2)
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
            return msg.id === id ? { ...msg, body: msg.body.slice(0, idx) + s + msg.body.slice(idx) } : msg
        })
    }

    deleteMessage = (id: number, idx1: number, idx2: number) => {
        this.messages = this.messages.map((msg: Message) => {
            return msg.id === id ? { ...msg, body: msg.body.slice(0, idx1) + msg.body.slice(idx2) } : msg
        })
    }
}

export const connectTo = (url: string, ctx: WSContext): WebSocket => {
    const ws = new WebSocket(url, "lrc.v1");
    ws.binaryType = "arraybuffer";
    ws.onopen = () => {
        console.log("connected")
        ctx.connected = true
        getTopic(ctx)
        setNick("wanderer", ctx)
        setColor(255, ctx)
        setDID("beep.boop", ctx)
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
        console.log("readyState:",ws.readyState)
        if (ws === ctx.ws) {
            ctx.connected = false
        }
    }
    return ws
}

export const initMessage = (ctx: WSContext) => {
    const evt: lrc.Event = {
        msg: {
            oneofKind: "init",
            init: {
                nick: ctx.nick,
                color: ctx.color,
                externalID: ctx.did
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

export const setDID = (did: string, ctx: WSContext) => {
    ctx.did = did
    const evt: lrc.Event = {
        msg: {
            oneofKind: "set",
            set: {
                externalID: did
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
            const did = event.msg.init.externalID ?? "origin"
            const color = event.msg.init.color ?? 12529712
            const body = ""
            const active = true
            const mine = echoed
            const muted = false
            const msg = { id, active, mine, muted, body, nick, did, color }
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
            const did = ""
            const body = ""
            ctx.pushMessage({ id, body, nick, muted, active, mine, color, did })
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
