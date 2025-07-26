<script lang="ts">
    import AutoGrowInput from "$lib/components/AutoGrowInput.svelte";
    import { WSContext } from "$lib/wscontext.svelte";
    import { numToHex } from "$lib/colors";
    import AutoGrowTextArea from "$lib/components/AutoGrowTextArea.svelte";
    import { getPrevCharBoundary, getNextCharBoundary } from "$lib/utils";
    interface Props {
        ctx: WSContext;
        defaultNick?: string;
        defaultHandle?: string;
    }
    let { ctx, defaultNick, defaultHandle }: Props = $props();
    let nick = $state(defaultNick ?? "wanderer");
    $effect(() => {
        if (ctx) {
            ctx.setNick(nick);
        }
    });
    let message = $state("");
    const setName = (event: Event) => {
        const el = event.target as HTMLInputElement;
        ctx.nick = el.value;
    };
    let handle = $state(defaultHandle ?? "xcvr.org");
    const setHandle = (event: Event) => {
        const el = event.target as HTMLInputElement;
        ctx.handle = el.value;
    };
    $effect(() => {
        if (ctx) {
            ctx.setHandle(handle);
        }
    });

    let color = $derived(numToHex(ctx.color));

    const bi = (event: InputEvent) => {
        const el = event.target as HTMLInputElement;
        switch (event.inputType) {
            case "insertLineBreak": {
                if (ctx.mySignet === undefined) {
                    event.preventDefault();
                    return;
                }
                ctx.insertLineBreak();
                el.value = "";
                event.preventDefault();
                return;
            }

            case "insertText": {
                const { selectionStart } = el;
                const { selectionEnd } = el;

                if (
                    selectionStart !== selectionEnd &&
                    selectionEnd !== null &&
                    selectionStart !== null
                ) {
                    ctx.delete(selectionStart, selectionEnd);
                }
                ctx.insert(selectionStart ?? 0, event.data ?? "");
                return;
            }

            case "insertFromPaste": {
                const { selectionStart } = el;
                const { selectionEnd } = el;
                if (
                    selectionStart !== selectionEnd &&
                    selectionEnd !== null &&
                    selectionStart !== null
                ) {
                    ctx.delete(selectionStart, selectionEnd);
                }
                ctx.insert(selectionStart ?? 0, event.data ?? "");
                return;
            }

            case "deleteContent": {
                const { selectionStart } = el;
                const { selectionEnd } = el;
                if (
                    selectionStart !== selectionEnd &&
                    selectionStart !== null &&
                    selectionEnd !== null
                ) {
                    ctx.delete(selectionStart, selectionEnd);
                }
            }

            case "deleteContentBackward": {
                const { selectionStart } = el;
                const { selectionEnd } = el;
                if (selectionStart !== null && selectionEnd !== null) {
                    if (selectionStart !== selectionEnd) {
                        ctx.delete(selectionStart, selectionEnd);
                    } else if (selectionStart !== 0) {
                        event.preventDefault();
                        const realStart = getPrevCharBoundary(
                            el.value,
                            selectionStart,
                        );
                        ctx.delete(realStart, selectionEnd);
                        el.value =
                            el.value.slice(0, realStart) +
                            el.value.slice(selectionEnd);
                        el.setSelectionRange(realStart, realStart);
                    }
                }
            }

            case "deleteContentForward": {
                const { selectionStart } = el;
                const { selectionEnd } = el;
                if (selectionStart !== null && selectionEnd !== null) {
                    if (selectionStart !== selectionEnd) {
                        ctx.delete(selectionStart, selectionEnd);
                    } else if (selectionEnd !== el.value.length) {
                        event.preventDefault();
                        const realEnd = getNextCharBoundary(
                            el.value,
                            selectionEnd,
                        );
                        ctx.delete(selectionStart, realEnd);
                        el.value =
                            el.value.slice(0, selectionStart) +
                            el.value.slice(realEnd);
                        el.setSelectionRange(selectionStart, selectionStart);
                    }
                }
            }

            case "historyUndo": {
            }
        }
    };
</script>

<div id="transmitter">
    <div class="wrapper" style:--theme={color}>
        <input
            type="range"
            min="0"
            max="16777215"
            bind:value={ctx.color}
            onchange={() => {
                ctx.setColor(ctx.color);
            }}
        />
        <AutoGrowInput
            bind:value={nick}
            {color}
            placeholder="your name"
            onInput={setName}
            maxlength={12}
            bold={true}
        />
        @
        <AutoGrowInput
            bind:value={handle}
            placeholder="alice.com"
            onInput={setHandle}
            maxlength={253}
            bold={false}
        />
    </div>
    <AutoGrowTextArea
        bind:value={message}
        placeholder="start typing..."
        onBeforeInput={bi}
        maxlength={65535}
    />
</div>

<style>
    .wrapper {
        position: relative;
        display: inline-block;
    }
    .wrapper :first-child {
        position: absolute;
        left: 0px;
        right: 0px;
        top: -2rem;
        bottom: 1em;
        display: none;
        accent-color: var(--theme);
    }
    .wrapper:focus-within :first-child {
        display: inline-block;
    }
</style>
