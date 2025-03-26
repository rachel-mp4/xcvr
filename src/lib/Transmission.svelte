<script lang="ts">
    import type { Message } from "../types";
    interface Props {
        message: Message;
    }
    let { message }: Props = $props();
</script>

<div>
    <b>{message.name}</b>
    {#if message.active}
        is typing
    {/if}
    {message.text}
</div>
