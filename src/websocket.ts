import { Context } from "./Context.svelte"

export const connectTo = (url: string, ctx: Context) => {
    const ws = new WebSocket(url); //"ws://localhost:927/ws"
    ws.binaryType = "arraybuffer";
    ws.onopen = () => {
        console.log("connected");
    };
    ws.onmessage = (event) => {
        parseEvent(event, ctx);
    };
    ws.onclose = () => {
        console.log("disconnected");
    };
}

function parseEvent(event: MessageEvent<any>, ctx: Context): void {
    const byteArray = new Uint8Array(event.data);
    switch (byteArray[5]) {
        case 0: {
            const text = new TextDecoder("ascii").decode(byteArray.slice(6));
            ctx.setTopic(text)
            return;
        }

        case 2: {
            const id = readId(byteArray.slice(1, 5));
            const color = byteArray[7];
            const name = new TextDecoder("ascii").decode(byteArray.slice(8));
            const text = "";
            const active = true;
            ctx.pushMessage({ id, color, name, text, active })
            return;
        }

        case 3: {
            const id = readId(byteArray.slice(1, 5));
            ctx.pubMessage(id)
            return;
        }

        case 4: {
            const id = readId(byteArray.slice(1, 5));
            const idx = readIdx(byteArray.slice(6, 8));
            const s = new TextDecoder("ascii").decode(byteArray.slice(8));
            ctx.insertMessage(id, idx, s)
            return;
        }

        case 5: {
            const id = readId(byteArray.slice(1, 5));
            const idx = readIdx(byteArray.slice(6, 8));
            ctx.backspaceMessage(id, idx)
            return;
        }
    }
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