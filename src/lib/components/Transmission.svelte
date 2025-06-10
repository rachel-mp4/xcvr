<script lang="ts">
    import type { Message } from "$lib/types";
    import { numToHex } from "$lib/colors";
    interface Props {
        message: Message;
    }
    let { message }: Props = $props();
    let color: string = numToHex(message.color);
</script>

<div
    style:--theme={color}
    class={message.active ? "active transmission" : "transmission"}
>
    <div class="header">{message.nick}{#if message.did}@{message.did}{/if}</div>
    <div class="body">{message.body}</div>
</div>

<style>
    .active {
        background-color: var(--theme);
        color: white;
    }
    .header {
        font-weight: 700;
    }

    .transmission {
        padding-bottom: 1rem;
    }

    .transmission:not(.active) .header {
        color: var(--theme);
    }
    .body {
        white-space: pre-wrap;
        word-wrap: break-word;
        max-width: 100%;
    }
</style>
