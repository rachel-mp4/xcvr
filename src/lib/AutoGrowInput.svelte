<script lang="ts">
    interface Props {
        onBeforeInput?: (event: InputEvent) => void;
        onInput?: (event: Event) => void;
        placeholder?: string;
        value?: string;
        size?: number;
        maxlength?: number;
        bold?: boolean
    }

    let {
        onBeforeInput,
        placeholder,
        value = $bindable(""),
        onInput,
        size = 5,
        maxlength,
        bold = false
    }: Props = $props();

    let inputEl: HTMLElement;
    function adjustSize(event: Event) {
        if (inputEl) {
            inputEl.style.width = "auto";
            inputEl.style.width = inputEl.scrollWidth + 1 + "px";
        }
        onInput?.(event)
    }
</script>

<input
    bind:value
    bind:this={inputEl}
    size={size}
    maxlength={maxlength}
    oninput={adjustSize}
    onbeforeinput={onBeforeInput}
    style:font-weight={bold ? "700" : "inherit"}
    {placeholder}
/>
