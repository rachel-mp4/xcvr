import type { AspectRatio, Item, Image, Message, LogItem, SignetView, MessageView, MediaView, ImageView } from "./types"
import { isMessage, isImage } from "./types"
import * as lrc from '@rachel-mp4/lrcproto/gen/ts/lrc'

// so the thing with the current message is that i require a signet to post
// which is not ideal because you might be in an lrc server that is working
// but the atproto integration isn't, and i want it to still be somewhat ok
// in that case. additionally, it means that in the first like round trip +
// however long it takes for atproto to propogate, you can't submit your
// message either.
// so i want to make that side of things better
type ATPBlob = {
    $type: string
    ref: string
    mimeType: string
    size: number
}

type ATPImage = {
    $type: string
    alt: string
    aspectRatio?: ATPAspectRatio
    blob?: ATPBlob
}

type ATPAspectRatio = {
    width: number
    height: number
}

export class WSContext {
    items: Array<Item> = $state(new Array())
    orphanedSignets: Map<string, SignetView> = new Map()
    orphanedMessages: Map<string, MessageView> = new Map()
    orphanedMedias: Map<string, MediaView> = new Map()
    log: Array<LogItem> = $state(new Array())
    topic: string = $state("")
    connected: boolean = $state(false)
    conncount = $state(0)
    ws: WebSocket | null = null
    ls: WebSocket | null = null
    color: number = $state(Math.floor(Math.random() * 16777216))

    channelUri: string
    active: boolean = false
    mediaactive: boolean = false
    nick: string = "wanderer"
    handle: string = ""

    myID: undefined | number
    myNonce: undefined | Uint8Array
    curMsg: string = $state("")
    mySignet: undefined | SignetView

    myMediaID: undefined | number
    myMediaNonce: undefined | Uint8Array
    atpblob: ATPBlob | undefined = $state()
    myMediaSignet: undefined | SignetView

    audio: HTMLAudioElement = new Audio('/notif.wav')
    shortaudio: HTMLAudioElement = new Audio('/shortnotif.wav')

    beepcoefficient: number = $state(0.0)
    junkword: string = $state("beep")
    shouldSend: boolean = $state(true)
    defaultmessage: string = $state("")
    postToMyRepo: boolean = $state(false)
    shouldTransmit: boolean = $state(true)
    lrceventqueue: Array<lrc.Edit> = []

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
        this.items = []
        this.orphanedMessages = new Map()
        this.orphanedMedias = new Map()
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
        this.items = []
        this.orphanedMessages = new Map()
        this.orphanedMedias = new Map()
        this.orphanedSignets = new Map()
        this.mySignet = undefined
        this.myID = undefined
        this.myNonce = undefined
    }

    starttransmit = () => {
        if (this.lrceventqueue.length != 0) {
            const evt: lrc.Event = {
                msg: {
                    oneofKind: "editbatch",
                    editbatch: {
                        edits: this.lrceventqueue,
                    }
                }
            }
            const byteArray = lrc.Event.toBinary(evt)
            this.ws?.send(byteArray)
            this.lrceventqueue = []
        }
    }

    insertLineBreak = () => {
        if (this.active) {
            this.starttransmit()
            pubMessage(this)
            const api = import.meta.env.VITE_API_URL
            let body = this.defaultmessage != "" ? this.defaultmessage : this.curMsg
            if (this.beepcoefficient > 0.0 && this.junkword != "") {
                if (body.length < (this.junkword.length + 1)) {
                    body = this.junkword
                }
                const nb = Math.floor(1.0 * body.length * this.beepcoefficient / this.junkword.length)
                for (let i = 0; i < nb; i++) {
                    const start = Math.floor((body.length - this.junkword.length) * Math.random())
                    body = body.slice(0, start) + this.junkword + body.slice(start + this.junkword.length)
                }
            }
            console.log(body)
            const record = {
                ...(this.mySignet && { signetURI: this.mySignet.uri }),
                ...(this.channelUri && { channelURI: this.channelUri }),
                ...(this.myID && { messageID: this.myID }),
                ...(this.myNonce && { nonce: b64encodebytearray(this.myNonce) }),
                body: body,
                ...(this.nick && { nick: this.nick }),
                ...(this.color && { color: this.color }),
            }
            const endpoint = this.postToMyRepo ? `${api}/lrc/mymessage` : `${api}/lrc/message`
            if (this.shouldSend) {
                const recordstrungified = JSON.stringify(record)
                fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: recordstrungified,
                }).then((response) => {
                    if (response.ok) {
                        console.log(response)
                    } else {
                        throw new Error(`HTTP ${response.status}`)
                    }
                }).catch(() => {
                    setTimeout(() => {
                        fetch(endpoint, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: recordstrungified,
                        }).then((val) => console.log(val), (val) => console.log(val))
                    }, 2000)
                })
            }
            this.active = false
            this.curMsg = ""
            this.mySignet = undefined
            this.myID = undefined
        }
    }

    pubImage = (alt: string, width: number | undefined, height: number | undefined) => {
        if (this.atpblob) {
            let aspectRatio: AspectRatio | undefined
            if (width && height) {
                aspectRatio = {
                    width: width,
                    height: height
                }
            }
            const image: ATPImage = {
                $type: "org.xcvr.lrc.image",
                alt: alt,
                blob: this.atpblob,
                ...(aspectRatio && { aspectRatio: aspectRatio })
            }
            const record = {
                ...(this.myMediaSignet && { signetURI: this.myMediaSignet.uri }),
                ...(this.channelUri && { channelURI: this.channelUri }),
                ...(this.myMediaID && { messageID: this.myMediaID }),
                ...(this.myNonce && { nonce: b64encodebytearray(this.myNonce) }),
                image: image,
                ...(this.nick && { nick: this.nick }),
                ...(this.color && { color: this.color }),
                type: "image"
            }
            const api = import.meta.env.VITE_API_URL
            const recordstrungified = JSON.stringify(record)
            const endpoint = `${api}/lrc/media`
            fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: recordstrungified,
            }).then((response) => {
                if (response.ok) {
                    console.log(response)
                } else {
                    throw new Error(`HTTP ${response.status}`)
                }
            }).catch(() => {
                setTimeout(() => {
                    fetch(endpoint, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: recordstrungified,
                    }).then((val) => console.log(val), (val) => console.log(val))
                }, 2000)
            })
            this.mediaactive = false
            this.atpblob = undefined
            this.myMediaSignet = undefined
            this.myMediaID = undefined
            // TODO: backend respond correctly 
            const uri = "beep"
            const contentAddress = `${api}/lrc/getImage?uri=${uri}`
            if (this.mediaactive) {
                pubImage(alt, contentAddress, this)
            }
        } else {
            pubImage(alt, undefined, this)
        }
    }

    initImage = (blob: File) => {
        if (!this.mediaactive) {
            initImage(this)
            this.mediaactive = true
            const api = import.meta.env.VITE_API_URL
            const endpoint = `${api}/lrc/image`
            const formData = new FormData()
            formData.append("image", blob)
            fetch(endpoint, {
                method: "POST",
                body: formData
            }).then((response) => {
                if (response.ok) {
                    response.json().then((atpblob) =>
                        this.atpblob = atpblob)
                } else {
                    throw new Error(`HTTP ${response.status}`)
                }
            }).catch((err) => { console.log(err) })
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
    mute = (id: number) => {
        muteMessage(id, this)
    }

    unmute = (id: number) => {
        unmuteMessage(id, this)
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
    pushItem = (item: Item) => {
        if (document.hidden || !document.hasFocus()) {
            this.audio.currentTime = 0
            this.audio.play()
        } else if (!item.mine) {
            this.shortaudio.currentTime = 0
            this.shortaudio.play()
        }
        if (this.items.length > 200) {
            this.items = [...this.items.slice(this.items.length - 199), item]
        } else {
            this.items.push(item)
        }
    }

    replaceItem = (id: number, newItem: Item) => {
        this.items = this.items.map((item: Item) => {
            return item.id === id ? newItem : item
        })
    }

    pubItem = (id: number) => {
        this.items = this.items.map((item: Item) => {
            return isMessage(item) && item.id === id ? { ...item, active: false } : item
        })
    }

    mediapubItem = (id: number, alt: string | undefined, contentAddress: string | undefined) => {
        this.items = this.items.map((item: Item) => {
            return isImage(item) && item.id === id ? { ...item, active: false, alt: alt, src: contentAddress } : item
        })
    }

    insertMessage = (id: number, idx: number, s: string) => {
        this.ensureExistenceOfMessage(id)
        this.items = this.items.map((item: Item) => {
            return isMessage(item) && item.id === id ? { ...item, body: insertSIntoAStringAtIdx(s, item.body, idx) } : item
        })
    }

    deleteMessage = (id: number, idx1: number, idx2: number) => {
        this.ensureExistenceOfMessage(id)
        this.items = this.items.map((item: Item) => {
            return isMessage(item) && item.id === id ? { ...item, body: deleteFromAStringBetweenIdxs(item.body, idx1, idx2) } : item
        })
    }

    ensureExistenceOfMessage = (id: number) => {
        const idx = this.items.findIndex((item) => { return item.id === id })
        if (idx === -1) {
            this.pushItem({
                type: 'message',
                body: "",
                id: id,
                active: true,
                mine: false,
                muted: false,
                startedAt: Date.now(),
            })
        }
    }

    addSignet = (signet: SignetView) => {
        if (signet.lrcId === this.myID) {
            this.mySignet = signet
        }
        if (signet.lrcId === this.myMediaID) {
            this.myMediaSignet = signet
        }
        console.log("now we are signing")
        const arrayIdx = this.items.findIndex(item => item.id === signet.lrcId)
        if (arrayIdx !== -1) {
            console.log("found appropriate signet c:")
            this.items = this.items.map((item: Item) => {
                return item.id === signet.lrcId ? { ...item, signetView: signet } : item
            })
        } else {
            console.log("couldn't find appropriate signet :c")
            const om = this.orphanedMessages.get(signet.uri)
            if (om !== undefined) {
                console.log("some orphan logic")
                const message = makeMessageFromSignetAndMessageViews(om, signet)
                const idx = this.items.findIndex(item => item.id > signet.lrcId)
                if (idx === -1) {
                    this.items.push(message)
                } else {
                    this.items = [...this.items.slice(0, idx), message, ...this.items.slice(idx)]
                }
                this.orphanedMessages.delete(signet.uri)
                return
            }
            const oi = this.orphanedMedias.get(signet.uri)
            if (oi !== undefined) {
                console.log("comse orphan logic 2")
                const image = makeImageFromSignetAndImageMediaViews(oi, signet)
                const idx = this.items.findIndex(item => item.id > signet.lrcId)
                if (idx === -1) {
                    this.items.push(image)
                } else {
                    this.items = [...this.items.slice(0, idx), image, ...this.items.slice(idx)]
                }
                this.orphanedMedias.delete(signet.uri)
                return
            }
            this.orphanedSignets.set(signet.uri, signet)
        }
    }

    verifyMessage = (message: MessageView) => {
        console.log("now we are verifying!")
        console.log(message.signetURI)
        const arrayIdx = this.items.findIndex(item => item.signetView?.uri === message.signetURI && item.signetView?.authorHandle === message.author.handle)
        if (arrayIdx !== -1) {
            console.log("found appropriate message c:")
            this.items = this.items.map((item: Item) => {
                return item.signetView?.uri === message.signetURI && isMessage(item) ?
                    { ...makeMessageFromSignetAndMessageViews(message, item.signetView), body: item.body, mine: item.mine } : item
            })
        }
        else {
            console.log("couldn't find appropriate message :c")
            const os = this.orphanedSignets.get(message.signetURI)
            if (os !== undefined) {
                console.log("some orphan logic")
                const m = makeMessageFromSignetAndMessageViews(message, os)
                const idx = this.items.findIndex(item => item.id > os.lrcId)
                if (idx === -1) {
                    this.items.push(m)
                } else {
                    this.items = [...this.items.slice(0, idx), m, ...this.items.slice(idx)]
                }
                this.orphanedSignets.delete(os.uri)
            } else {
                this.orphanedMessages.set(message.signetURI, message)
            }
        }
    }

    verifyImageMediaView = (media: MediaView) => {
        console.log("now we are verifying!")
        console.log(media.signetURI)
        const arrayIdx = this.items.findIndex(item => item.signetView?.uri === media.signetURI && item.signetView?.authorHandle === media.author.handle)
        if (arrayIdx !== -1) {
            console.log("found appropriate message c:")
            this.items = this.items.map((item: Item) => {
                return item.signetView?.uri === media.signetURI && isMessage(item) ?
                    { ...makeImageFromSignetAndImageMediaViews(media, item.signetView), body: item.body, mine: item.mine } : item
            })
        }
        else {
            console.log("couldn't find appropriate message :c")
            const os = this.orphanedSignets.get(media.signetURI)
            if (os !== undefined) {
                console.log("some orphan logic")
                const m = makeImageFromSignetAndImageMediaViews(media, os)
                const idx = this.items.findIndex(item => item.id > os.lrcId)
                if (idx === -1) {
                    this.items.push(m)
                } else {
                    this.items = [...this.items.slice(0, idx), m, ...this.items.slice(idx)]
                }
                this.orphanedSignets.delete(os.uri)
            } else {
                this.orphanedMedias.set(media.signetURI, media)
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
        type: 'message',
        uri: m.uri,
        body: "i didn't catch the lrc message body :c",
        mbody: m.body,
        id: s.lrcId,
        active: false,
        mine: false,
        muted: false,
        ...(m.color && { color: m.color }),
        handle: m.author.handle,
        profileView: m.author,
        signetView: s,
        ...(m.nick && { nick: m.nick }),
        startedAt: Date.parse(s.startedAt)
    }
}

const makeImageFromSignetAndImageMediaViews = (i: MediaView, s: SignetView): Image => {
    return {
        type: 'image',
        uri: i.uri,
        id: s.lrcId,
        active: false,
        mine: false,
        muted: false,
        malt: i.imageView?.alt,
        ...(i.imageView?.src && { src: i.imageView.src }),
        ...(i.imageView?.aspectRatio && { maspectRatio: i.imageView.aspectRatio }),
        ...(i.nick && { nick: i.nick }),
        ...(i.color && { color: i.color }),
        handle: i.author.handle,
        profileView: i.author,
        signetView: s,
        startedAt: Date.parse(s.startedAt),
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
            const startedAt = lex.startedAt
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
        case "org.xcvr.lrc.defs#mediaView": {
            console.log("parsing media!!!")
            const uri = lex.uri
            const author = {
                did: lex.author.did,
                handle: lex.author.handle,
                ...(lex.author.displayName && { displayName: lex.author.displayName }),
                ...(lex.author.status && { status: lex.author.status }),
                ...(lex.author.color && { color: lex.author.color }),
                ...(lex.author.avatar && { avatar: lex.author.avatar }),
            }
            var imageView: ImageView | undefined
            if (lex.imageView) {
                console.log("has an image!")
                imageView = {
                    alt: lex.imageView.alt,
                    ...(lex.imageView.src && { src: lex.imageView.src }),
                    ...(lex.imageView.aspectRatio && { aspectRatio: lex.imageView.aspectRatio }),
                }
            }
            const nick = lex.nick
            const color = lex.color
            const signetURI = lex.signetURI
            const postedAt = lex.postedAt
            ctx.verifyImageMediaView({
                uri: uri,
                author: author,
                ...(imageView && { imageView: imageView }),
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

export const initImage = (ctx: WSContext) => {
    console.log("send media init!!!")
    const evt: lrc.Event = {
        msg: {
            oneofKind: "mediainit",
            mediainit: {
                nick: ctx.nick,
                color: ctx.color,
                externalID: ctx.handle
            }
        }
    }
    const byteArray = lrc.Event.toBinary(evt)
    ctx.ws?.send(byteArray)
}

export const pubImage = (alt: string | undefined, contentAddress: string | undefined, ctx: WSContext) => {
    const evt: lrc.Event = {
        msg: {
            oneofKind: "mediapub",
            mediapub: {
                alt: alt,
                contentAddress: contentAddress,
            }
        }
    }
    const byteArray = lrc.Event.toBinary(evt)
    ctx.ws?.send(byteArray)
}

export const insertMessage = (idx: number, s: string, ctx: WSContext) => {
    if (ctx.shouldTransmit) {
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
    } else {
        const edit: lrc.Edit = {
            edit: {
                oneofKind: "insert",
                insert: {
                    utf16Index: idx,
                    body: s
                }
            }
        }
        ctx.lrceventqueue.push(edit)
    }
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
    if (ctx.shouldTransmit) {

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
    } else {
        const edit: lrc.Edit = {
            edit: {
                oneofKind: "delete",
                delete: {
                    utf16Start: idx,
                    utf16End: idx2
                }
            }
        }
        ctx.lrceventqueue.push(edit)
    }
}

export const muteMessage = (id: number, ctx: WSContext) => {
    const evt: lrc.Event = {
        msg: {
            oneofKind: "mute",
            mute: {
                id: id,
            }
        }
    }
    const byteArray = lrc.Event.toBinary(evt)
    ctx.ws?.send(byteArray)
}

export const unmuteMessage = (id: number, ctx: WSContext) => {
    const evt: lrc.Event = {
        msg: {
            oneofKind: "unmute",
            unmute: {
                id: id,
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
            const msg: Message = {
                type: 'message',
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
            ctx.pushItem(msg)
            ctx.pushToLog(id, byteArray, "init")
            return true
        }

        case "mediainit": {
            console.log("media init!!!!")
            const id = event.msg.mediainit.id ?? 0
            if (id === 0) return false
            const echoed = event.msg.mediainit.echoed ?? false
            if (echoed) {
                ctx.myMediaID = id
                ctx.myMediaNonce = event.msg.mediainit.nonce
                // return false
            }
            const nick = event.msg.mediainit.nick
            const handle = event.msg.mediainit.externalID
            const color = event.msg.mediainit.color
            const active = true
            const mine = echoed
            const muted = false
            const startedAt = Date.now()
            const msg: Image = {
                type: 'image',
                id: id,
                active: active,
                mine: mine,
                muted: muted,
                ...(color && { color: color }),
                ...(handle && { handle: handle }),
                ...(nick && { nick: nick }),
                startedAt: startedAt
            }
            ctx.pushItem(msg)
            ctx.pushToLog(id, byteArray, "init")
            return true
        }

        case "pub": {
            const id = event.msg.pub.id ?? 0
            if (id === 0) return false
            ctx.pubItem(id)
            ctx.pushToLog(id, byteArray, "pub")
            return false
        }

        case "mediapub": {
            const id = event.msg.mediapub.id ?? 0
            if (id === 0) return false
            ctx.mediapubItem(id, event.msg.mediapub.alt, event.msg.mediapub.contentAddress)
            ctx.pushToLog(id, byteArray, "pub")
            return false
        }

        case "insert": {
            const id = event.msg.insert.id ?? 0
            if (id === 0) return false
            ctx.pushToLog(id, byteArray, "insert")
            doinsert(id, event.msg.insert, ctx)
            return false
        }

        case "delete": {
            const id = event.msg.delete.id ?? 0
            if (id === 0) return false
            ctx.pushToLog(event.msg.delete.id ?? 0, byteArray, "delete")
            dodelete(id, event.msg.delete, ctx)
            return false
        }


        case "mute": {
            const id = event.msg.mute.id ?? 0
            if (id === 0) return false
            const muted = true
            const active = true
            const mine = false
            const body = ""
            const startedAt = Date.now()
            const msg: Message = {
                type: "message",
                id: id,
                body: body,
                muted: muted,
                active: active,
                mine: mine,
                startedAt: startedAt
            }

            ctx.pushItem(msg)
            return false
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
            return false
        }
        //TODO: better logging system so that way even non hrt messages
        // can have the background effect!
        case "editbatch": {
            const id = event.id ?? 0
            if (id === 0) {
                return false
            }
            event.msg.editbatch.edits.forEach((edit: lrc.Edit) => {
                switch (edit.edit.oneofKind) {
                    case "insert": {
                        doinsert(id, edit.edit.insert, ctx)
                        return
                    }
                    case "delete": {
                        dodelete(id, edit.edit.delete, ctx)
                        return
                    }
                }
            })
            return false

        }

    }
    return false
}

function doinsert(id: number, insert: lrc.Insert, ctx: WSContext) {
    const idx = insert.utf16Index
    const s = insert.body
    ctx.insertMessage(id, idx, s)
}

function dodelete(id: number, del: lrc.Delete, ctx: WSContext) {
    const idx = del.utf16Start
    const idx2 = del.utf16End
    ctx.deleteMessage(id, idx, idx2)
}

