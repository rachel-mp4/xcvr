<script lang="ts">
    import { onMount } from "svelte";

    interface Props {
        onBeforeInput?: (event: InputEvent) => void;
        onInput?: (event: InputEvent) => void;
        placeholder?: string;
        value?: string;
        maxlength?: number;
        bold?: boolean;
        color?: string;
        fs?: string;
    }

    let {
        onBeforeInput,
        placeholder,
        value = $bindable(""),
        onInput,
        maxlength,
        bold = false,
        color,
        fs,
    }: Props = $props();

    let inputEl: HTMLTextAreaElement;
    function adjust(event: Event) {
        onInput?.(event as InputEvent);
        console.log(checkEmoji(inputEl.selectionStart, inputEl.selectionEnd));
    }

    function bi(event: InputEvent) {
        onBeforeInput?.(event);
        adjustHeight();
    }

    function adjustHeight() {
        if (inputEl) {
            inputEl.style.height = "auto";
            inputEl.style.height = inputEl.scrollHeight + "px";
        }
    }
    onMount(adjustHeight);
    $effect(() => {
        value;
        adjustHeight();
    });
    function checkEmoji(
        selectionStart: number | null,
        selectionEnd: number | null,
    ): string | null {
        if (selectionStart !== selectionEnd || selectionStart === null) {
            return null;
        }
        const text = inputEl.value;
        let colonPos = -1;
        for (
            let i = selectionStart - 1;
            i > -1 && i > selectionStart - 16;
            i--
        ) {
            const char = text[i];
            if (char === ":") {
                colonPos = i;
                break;
            }
            if (char === " " || char === "\n" || char === "\t") {
                break;
            }
        }
        if (colonPos === -1) {
            return null;
        }
        return text.slice(colonPos, selectionStart);
    }
</script>

<div class="autogrowwrapper">
    <textarea
        rows="1"
        bind:value
        bind:this={inputEl}
        {maxlength}
        oninput={adjust}
        onbeforeinput={bi}
        style:font-weight={bold ? "700" : "inherit"}
        style:--theme={color}
        style:font-size={fs ?? "1rem"}
        {placeholder}
    ></textarea>
</div>

<style>
    textarea {
        width: 100%;
        font: inherit;
        padding: 0;
        margin: 0;
        display: block;
        resize: none;
        border: none;
        background: var(--fl);
    }
    .autogrowwrapper {
        position: relative;
    }

    .autogrowwrapper::before {
        content: "";
        position: absolute;
        inset: 0;
        background: var(--fg);
        z-index: -1;
    }
</style>
