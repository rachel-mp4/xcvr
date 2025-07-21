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
    {message.signetView ? 'signed' : ''} 
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
    .signed .handle {
        color: var(--fg);
    }
    :not(:is(.signed, .active)) .handle {
        color: var(--mg);
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
