import type { Message } from "./types"

export class Context {
    messages: Array<Message> = $state(new Array());
    topic: string = $state("loading...")

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