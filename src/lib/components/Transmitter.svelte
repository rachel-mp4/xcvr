<script lang="ts">
    import AutoGrowInput from "$lib/components/AutoGrowInput.svelte";
    import { WSContext } from "$lib/wscontext.svelte";
    import { numToHex } from "$lib/colors";
    import AutoGrowTextArea from "$lib/components/AutoGrowTextArea.svelte";
    import diff from "fast-diff";
    interface Props {
        ctx: WSContext;
        defaultNick?: string;
        defaultHandle?: string;
        shouldTransmit?: boolean;
        tryinit?: () => void;
    }
    let { ctx, defaultNick, defaultHandle, shouldTransmit, tryinit }: Props =
        $props();
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
    const diffAndSend = (event: InputEvent) => {
        const el = event.target as HTMLInputElement;
        diffAndSendEl(el);
    };
    const diffAndSendEl = (el: HTMLInputElement) => {
        const result = diff(message, el.value);
        let idx = 0;
        result.forEach((d) => {
            switch (d[0]) {
                case -1:
                    const idx2 = idx + d[1].length;
                    ctx.delete(idx, idx2);
                    break;
                case 0:
                    idx = idx + d[1].length;
                    break;
                case 1:
                    ctx.insert(idx, d[1]);
                    idx = idx + d[1].length;
                    break;
            }
        });
        message = el.value;
    };

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
                message = "";
                return;
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
            placeholder="alice"
            onInput={setName}
            maxlength={12}
            bold={true}
        />
        @
        <AutoGrowInput
            bind:value={handle}
            placeholder="alice.com"
            size={8}
            onInput={setHandle}
            maxlength={253}
            bold={false}
        />
    </div>
    <AutoGrowTextArea
        {tryinit}
        placeholder="start typing..."
        onBeforeInput={bi}
        onInput={diffAndSend}
        {shouldTransmit}
        transmitfunc={diffAndSendEl}
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
