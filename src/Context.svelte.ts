import type { Message } from "./types"
import { ping, connectTo, initMessage, pubMessage, insertMessage, backspaceMessage } from "./websocket";

export class Context {
    messages: Array<Message> = $state(new Array());
    topic: string = $state("loading...")
    ws: WebSocket
    curMsg: string = ""
    active: boolean = false
    name: string = ""
    pendingPing: ((pongTime: number) => void) | null = null

    insertLineBreak = () => {
        if (this.active) {
            pubMessage(this)
            this.active = false
            this.curMsg = ""
        }
    }

    insert = (idx: number, s: string) => {
        if (!this.active) {
            initMessage(220, this.name, this)
            this.active = true
        }
        insertMessage(idx, s, this)
        this.curMsg = this.curMsg.slice(0,idx) + s + this.curMsg.slice(idx)
    }

    delete = (idx: number) => {
        if (!this.active) {
            return
        }
        backspaceMessage(idx, this)
        this.curMsg = this.curMsg.slice(0,idx - 1) + this.curMsg.slice(idx)
    }

    constructor(url: string) {
        this.ws = connectTo(url, this)
        this.startPinging()
    }

    startPinging = async () => {
        setInterval(async () => {
            const pingTime = await ping(this)
            console.log(pingTime)
        }, 5000)
    }

    setTopic = (topic: string) => {
        this.topic = topic
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
            return msg.id === id ? { ...msg, text: msg.text.slice(0, idx) + s + msg.text.slice(idx) } : msg
        })
    }

    deleteMessage = (id: number, idx1: number, idx2: number) => {
        this.messages = this.messages.map((msg:Message) => {
            return msg.id === id ? { ...msg, text: msg.text.slice(0, idx1) + msg.text.slice(idx2)} : msg
        })
    }

    backspaceMessage = (id: number, idx: number) => {
        this.messages = this.messages.map((msg:Message) => {
            return msg.id === id ? { ...msg, text: msg.text.slice(0, idx - 1) + msg.text.slice(idx)} : msg
        })
    }
}