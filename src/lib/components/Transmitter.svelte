<script lang="ts">
    import AutoGrowInput from "$lib/components/AutoGrowInput.svelte";
    import { WSContext } from "$lib/wscontext.svelte";
    import { ansiToHex } from "$lib/colors";
    import AutoGrowTextArea from "$lib/components/AutoGrowTextArea.svelte";
    interface Props {
        ctx: WSContext;
    }
    let { ctx }: Props = $props();
    let name = $state("wanderer");
    ctx.name = "wanderer";
    $effect( () => {
        if (ctx) {
            ctx.name = name
        }
    })
    let message = $state("");
    const setName = (event: Event) => {
        const el = event.target as HTMLInputElement;
        ctx.name = el.value;
    };

    let color = $derived(ansiToHex(ctx.color));

    const bi = (event: InputEvent) => {
        const el = event.target as HTMLInputElement;
        switch (event.inputType) {
            case "insertLineBreak": {
                ctx.insertLineBreak();
                el.value = "";
                event.preventDefault();
                return;
            }

            case "insertText": {
                const { selectionStart } = el;
                let { selectionEnd } = el;
                while (selectionStart !== selectionEnd) {
                    if (selectionEnd === null) {
                        break;
                    }
                    ctx.delete(selectionEnd);
                    selectionEnd -= 1;
                }
                ctx.insert(selectionStart ?? 0, event.data ?? "");
                return;
            }

            case "insertFromPaste": {
                const { selectionStart } = el;
                let { selectionEnd } = el;
                while (selectionStart !== selectionEnd) {
                    if (selectionEnd === null) {
                        break;
                    }
                    ctx.delete(selectionEnd);
                    selectionEnd -= 1;
                }
                ctx.insert(selectionStart ?? 0, event.data ?? "");
                return;
            }

            case "deleteContent": {
                const { selectionStart } = el;
                let { selectionEnd } = el;
                while (selectionStart !== selectionEnd) {
                    if (selectionEnd === null) {
                        break;
                    }
                    ctx.delete(selectionEnd);
                    selectionEnd -= 1;
                }
                ctx.delete(selectionStart ?? 0);
            }

            case "deleteContentBackward": {
                const { selectionStart } = el;
                let { selectionEnd } = el;
                let looped = false;
                while (selectionStart !== selectionEnd) {
                    if (selectionEnd === null) {
                        break;
                    }
                    ctx.delete(selectionEnd);
                    selectionEnd -= 1;
                    looped = true;
                }
                if (looped) {
                    return;
                }
                ctx.delete(selectionStart ?? 0);
            }

            case "historyUndo": {
            }
        }
    };
</script>

<div id="transmitter">
    <div class="wrapper" style:--theme={color}>
        <input type="range" min="0" max="255" bind:value={ctx.color} />
        <AutoGrowInput
            bind:value={name}
            {color}
            placeholder="your name"
            onInput={setName}
            maxlength={12}
            bold={true}
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
