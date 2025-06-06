import { WSContext } from "./Context.svelte"

export const connectTo = (url: string, ctx: WSContext): WebSocket => {
    const ws = new WebSocket(url); 
    ws.binaryType = "arraybuffer";
    ws.onopen = () => {
        ctx.connected = true
    };
    ws.onmessage = (event) => {
        const shouldScroll = parseEvent(event, ctx);
        if (shouldScroll) {
            setTimeout(() => {
                window.scrollTo(0, document.body.scrollHeight)
            }, 0)
        }

    };
    ws.onclose = () => {
        ctx.connected = false
    };
    ws.onerror = () => {
        ctx.connected = false
    }
    return ws
}

export async function ping(ctx: WSContext): Promise<number> {
    return new Promise((resolve) => {
        ctx.pendingPing = (pongTime: number) => {
            const pingTime = pongTime - startTime
            resolve(pingTime)
        }
        const startTime = performance.now()
        ctx.ws.send(new Uint8Array([2, 0]))
    })
}

export const initMessage = (color: number, name: string, ctx: WSContext) => {
    const byteArray = initObjectToByteArray({ color: color, name: name })
    ctx.ws.send(byteArray)
}

export const insertMessage = (idx: number, s: string, ctx: WSContext) => {
    const byteArray = insertObjectToByteArray({ idx, s })
    ctx.ws.send(byteArray)
}

export const pubMessage = (ctx: WSContext) => {
    ctx.ws.send(pubObjectToByteArray())
}

export const backspaceMessage = (idx: number, ctx: WSContext) => {
    const byteArray = backspaceObjectToByteArray({ idx })
    ctx.ws.send(byteArray)
}

function parseEvent(event: MessageEvent<any>, ctx: WSContext): boolean {
    const byteArray = new Uint8Array(event.data);
    switch (byteArray[5]) {
        case 0: {
            const text = new TextDecoder("ascii").decode(byteArray.slice(6));
            ctx.setTopic(text)
            return false;
        }

        case 1: {
            if (ctx.pendingPing !== null) {
                ctx.pendingPing(performance.now())
                ctx.pendingPing = null
            }
            return false
        }

        case 2: {
            const { id, color, name } = byteArrayToInitObject(byteArray)
            const text = "";
            const active = true;
            ctx.pushMessage({ id, color, name, text, active })
            return true
        }

        case 3: {
            const { id } = byteArrayToPubObject(byteArray)
            ctx.pubMessage(id)
            return false
        }

        case 4: {
            const { id, idx, s } = byteArrayToInsertObject(byteArray)
            ctx.insertMessage(id, idx, s)
            return false
        }

        case 5: {
            const { id, idx } = byteArrayToBackspaceObject(byteArray)
            ctx.backspaceMessage(id, idx)
            return false
        }
    }
    return false
}



function byteArrayToInitObject(byteArray: Uint8Array): { id: number, color: number, name: string } {
    const id = readId(byteArray.slice(1, 5));
    const color = byteArray[7];
    const name = new TextDecoder("utf-8").decode(byteArray.slice(8));
    return { id: id, color: color, name: name }
}

function initObjectToByteArray(initObj: { color: number, name: string }): Uint8Array {
    const nameArray = new TextEncoder().encode(initObj.name)
    return (new Uint8Array([4 + nameArray.length, 2, 0, initObj.color, ...nameArray]))
}

function byteArrayToPubObject(byteArray: Uint8Array): { id: number } {
    const id = readId(byteArray.slice(1, 5));
    return { id: id }
}

function pubObjectToByteArray(): Uint8Array {
    return (new Uint8Array([2, 3]))
}

function byteArrayToInsertObject(byteArray: Uint8Array): { id: number, idx: number, s: string } {
    const id = readId(byteArray.slice(1, 5));
    const idx = readIdx(byteArray.slice(6, 8));
    const s = new TextDecoder("utf-8").decode(byteArray.slice(8));
    return { id: id, idx: idx, s: s }
}

function insertObjectToByteArray(insertObj: { idx: number, s: string }): Uint8Array {
    const sArray = new TextEncoder().encode(insertObj.s)
    const idxArray = new Uint8Array(2)
    const view = new DataView(idxArray.buffer)
    view.setUint16(0, insertObj.idx, false)
    return (new Uint8Array([4 + sArray.length, 4, ...idxArray, ...sArray]))
}

function byteArrayToBackspaceObject(byteArray: Uint8Array): { id: number, idx: number } {
    const id = readId(byteArray.slice(1, 5));
    const idx = readIdx(byteArray.slice(6, 8));
    return { id: id, idx: idx }
}

function backspaceObjectToByteArray(insertObj: { idx: number }): Uint8Array {
    const idxArray = new Uint8Array(2)
    const view = new DataView(idxArray.buffer)
    view.setUint16(0, insertObj.idx, false)
    return (new Uint8Array([4, 5, ...idxArray]))
}

function readId(bytes: Uint8Array): number {
    return new DataView(
        bytes.buffer,
        bytes.byteOffset,
        bytes.byteLength,
    ).getUint32(0, false);
}

function readIdx(bytes: Uint8Array): number {
    return new DataView(
        bytes.buffer,
        bytes.byteOffset,
        bytes.byteLength,
    ).getUint16(0, false);
}