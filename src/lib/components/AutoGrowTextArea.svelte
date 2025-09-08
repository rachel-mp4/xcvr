<script lang="ts">
    import { onMount } from "svelte";
    import Fuse from "fuse.js";
    import emojis from "$lib/keyword-emojis.json";

    interface Props {
        onBeforeInput?: (event: InputEvent) => void;
        onInputEl?: (el: HTMLTextAreaElement) => void;
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
        onInputEl,
        maxlength,
        bold = false,
        color,
        fs,
    }: Props = $props();
    let curemoji: [string, number, number] | null = $state(null);

    let inputEl: HTMLTextAreaElement;
    function adjust(event: Event) {
        onInputEl?.(inputEl);
        curemoji = checkAndSearch();
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
    ): [string, number, number] | null {
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
        const res = text.slice(colonPos + 1, selectionStart);
        if (res.length < 3) return null;
        return [res, colonPos, selectionStart];
    }
    const fuseOptions = {
        keys: ["keywords"],
    };
    const fuse = new Fuse(emojis, fuseOptions);
    function searchEmoji(s: string): string | null {
        const results = fuse.search(s);
        if (results.length === 0) {
            return null;
        }
        return results[0].item.emoji;
    }
    function checkAndSearch(): [string, number, number] | null {
        const query = checkEmoji(inputEl.selectionStart, inputEl.selectionEnd);
        if (query === null) {
            return null;
        }
        const emoji = searchEmoji(query[0]);
        if (emoji === null) return null;
        return [emoji, query[1], query[2]];
    }
    function emojifier(e: KeyboardEvent) {
        if (curemoji === null) {
            return;
        }
        switch (e.key) {
            case "Tab":
                e.preventDefault();
                e.stopPropagation();
                inputEl.value =
                    inputEl.value.slice(0, curemoji[1]) +
                    curemoji[0] +
                    inputEl.value.slice(curemoji[2]);
                onInputEl?.(inputEl);
                return;
        }
    }
</script>

<div class="autogrowwrapper">
    <textarea
        rows="1"
        bind:value
        bind:this={inputEl}
        {maxlength}
        oninput={adjust}
        onkeydown={emojifier}
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
