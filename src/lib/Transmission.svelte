<script lang="ts">
    import type { Message } from "../types";
    import { ansiToHex } from "../colors";
    interface Props {
        message: Message;
    }
    let { message }: Props = $props();
    let color: string = ansiToHex(message.color);
</script>

<div style:--theme={color} class={message.active ? "active" : " "}>
    <b>{message.name}</b>
    {message.text}
</div>

<style>
    .active {
        background-color: var(--theme);
        color: white;
    }
    div:not(.active) b {
        color: var(--theme);
    }
    div {
        white-space: pre-wrap;
    }
</style>
