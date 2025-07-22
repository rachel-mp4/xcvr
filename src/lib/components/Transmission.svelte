<script lang="ts">
    import type { Message } from "$lib/types";
    import { hexToContrast, hexToTransparent, numToHex } from "$lib/colors";
    interface Props {
        message: Message;
    }
    let { message }: Props = $props();
    let color: string = numToHex(message.color ?? 16777215);
    let contrast: string = hexToContrast(color);
    let partial: string = hexToTransparent(contrast);
</script>

<div
    style:--theme={color}
    style:--tcontrast={contrast}
    style:--tpartial={partial}
    class="{message.active ? 'active' : ''} 
    {message.profileView ? 'signed' : ''} 
    transmission"
>
    <div class="header">
        {message.nick}{#if message.handle}
            <span class="handle">@{message.handle}</span>{/if}
        {#if message.profileView}beep{/if}
    </div>
    <div class="body">{message.body}</div>
</div>

<style>
    .active {
        background-color: var(--theme);
        color: var(--tcontrast);
    }
    .header {
        font-weight: 700;
    }
    .active .handle {
        color: var(--tpartial);
    }
    .active.signed .handle {
        color: var(--tcontrast);
    }
    .signed .handle {
        color: var(--fg);
    }
    .handle {
        color: var(--fl);
        position: relative;
    }

    .handle::after {
        content: "";
        color: var(--fg);
        background: var(--bg);
        position: absolute;
        left: 0;
        right: 0;
        top: calc(55% - 0.125rem);
        bottom: calc(45% - 0.125rem);
        transform: scaleX(0);
        transform-origin: center left;
        transition: transform 0.17s 3s;
    }

    .transmission:not(.signed):not(.active) .handle::after {
        transform: scaleX(1);
    }
    .transmission:not(.signed):not(.active) .handle:hover::after {
        content: "i couldn't find a record :c";
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
