<script lang="ts">
    import { onMount } from "svelte";
    import Fuse from "fuse.js";
    import emojis from "$lib/keyword-emojis.json";
    import { computePosition, flip } from "@floating-ui/dom";

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
    let curemojiresults: [EmojiSearchResults, number, number] | null =
        $state(null);
    let curemojinumber: null | number = $state(null);
    let curemoji: null | string = $derived(
        curemojiresults && curemojinumber
            ? curemojiresults[0][curemojinumber]
            : null,
    );

    let inputEl: HTMLTextAreaElement;
    let emojilist: HTMLElement | undefined = $state();
    function adjust(event: Event) {
        onInputEl?.(inputEl);
        curemojiresults = checkAndSearch();
        if (curemojiresults !== null) {
            curemojinumber = 0;
        }
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
        includeMatches: true,
        keys: ["keywords"],
    };
    const fuse = new Fuse(emojis, fuseOptions);
    type RangeTuple = [number, number];

    type FuseResultMatch = {
        indices: ReadonlyArray<RangeTuple>;
        key?: string;
        refIndex?: number;
        value?: string;
    };
    type FuseResult<T> = {
        item: T;
        refIndex: number;
        score?: number;
        matches?: ReadonlyArray<FuseResultMatch>;
    };
    type EmojiSearchResults = FuseResult<{
        emoji: string;
        keywords: string[];
    }>[];
    function searchEmoji(s: string): null | EmojiSearchResults {
        const results = fuse.search(s);
        if (results.length === 0) {
            return null;
        }
        return results;
    }
    function checkAndSearch(): [EmojiSearchResults, number, number] | null {
        const query = checkEmoji(inputEl.selectionStart, inputEl.selectionEnd);
        if (query === null) {
            return null;
        }
        const emoji = searchEmoji(query[0]);
        if (emoji === null) return null;
        return [emoji, query[1], query[2]];
    }
    function emojifier(e: KeyboardEvent) {
        if (
            curemojiresults === null ||
            curemojinumber === null ||
            curemoji === null
        ) {
            return;
        }
        switch (e.key) {
            case "Tab":
                e.preventDefault();
                e.stopPropagation();
                inputEl.value =
                    inputEl.value.slice(0, curemojiresults[1]) +
                    curemoji +
                    inputEl.value.slice(curemojiresults[2]);
                onInputEl?.(inputEl);
                curemoji = null;
                curemojiresults = null;
                curemojinumber = null;
                return;
            case "ArrowDown":
                e.preventDefault();
                e.stopPropagation();
                curemojinumber = curemojinumber + 1;
                if (curemojinumber > curemojiresults[0].length - 1)
                    curemojinumber = 0;
                return;
            case "ArrowUp":
                e.preventDefault();
                e.stopPropagation();
                curemojinumber = curemojinumber - 1;
                if (curemojinumber < 0)
                    curemojinumber = curemojiresults[0].length - 1;
                return;
        }
    }
    $effect(() => {
        if (inputEl && emojilist) {
            computePosition(inputEl, emojilist, {
                placement: "top",
                middleware: [flip()],
            }).then(({ x, y }) => {
                if (emojilist !== undefined) {
                    Object.assign(emojilist.style, {
                        left: `${x}px`,
                        top: `${y}px`,
                    });
                }
            });
        }
    });
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
    {#if curemojiresults !== null && curemojinumber !== null}
        <div bind:this={emojilist} class="emoji-selector">
            {#each curemojiresults[0] as result, idx}
                <div
                    class={curemojinumber === idx
                        ? "selected emoji-result"
                        : "emoji-result"}
                >
                    {result.item.emoji}
                    {#if result.matches && result.matches[0] !== null}{result
                            .matches[0].value}{/if}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .emoji-selector {
        width: max-content;
        position: absolute;
        top: 0;
        left: 0;
    }
    .selected.emoji-result {
        background: var(--fg);
        color: var(--bg);
    }
    .emoji-result {
        color: var(--fg);
        background: var(--bg);
    }
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
