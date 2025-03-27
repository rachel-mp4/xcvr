<script lang="ts">
    import AutoGrowInput from "./AutoGrowInput.svelte";
    import { Context } from "../Context.svelte";
    interface Props {
        ctx: Context;
    }
    let { ctx }: Props = $props();
    let name = $state("wanderer");
    ctx.name = "wanderer"
    let message = $state("");
    const setName = (event: Event) => {
        const el = event.target as HTMLInputElement;
        ctx.name = el.value;
    };

    const bi = (event: InputEvent) => {
        const el = event.target as HTMLInputElement;
        console.log(event.inputType)
        switch (event.inputType) {
            case "insertLineBreak": {
                ctx.insertLineBreak();
                el.value = "";
                return;
            }

            case "insertText": {
                const { selectionStart } = el;
                let { selectionEnd } = el;
                while (selectionStart != selectionEnd) {
                    if (selectionEnd == null) {
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
                while (selectionStart != selectionEnd) {
                    if (selectionEnd == null) {
                        break;
                    }
                    ctx.delete(selectionEnd);
                    selectionEnd -= 1;
                }
                ctx.insert(selectionStart ?? 0, event.data ?? "");
                return;
            }

            case "deleteContent": {
                const { selectionStart } = el
                let { selectionEnd } = el
                while (selectionStart != selectionEnd) {
                    if (selectionEnd == null) {
                        break;
                    }
                    ctx.delete(selectionEnd);
                    selectionEnd -= 1
                }
                ctx.delete(selectionStart ?? 0)
            }

            case "deleteContentBackward": {
                const { selectionStart } = el
                let { selectionEnd } = el
                let looped = false
                while (selectionStart != selectionEnd) {
                    if (selectionEnd == null) {
                        break;
                    }
                    ctx.delete(selectionEnd);
                    selectionEnd -= 1
                    looped = true
                }
                if (looped) {
                    return
                }
                ctx.delete(selectionStart ?? 0)
            }

            case "historyUndo": {
                console.log(event)
            }
        }
    };
</script>

<div>
    <AutoGrowInput
        bind:value={name}
        placeholder="your name"
        onInput={setName}
        maxlength={12}
        bold={true}
    />
    <AutoGrowInput
        bind:value={message}
        placeholder="start typing..."
        onBeforeInput={bi}
        size={12}
        maxlength={65535}
    />
</div>
