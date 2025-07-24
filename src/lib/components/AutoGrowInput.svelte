<script lang="ts">
    import { onMount } from "svelte";

    interface Props {
        onBeforeInput?: (event: InputEvent) => void;
        onInput?: (event: Event) => void;
        placeholder?: string;
        value?: string;
        size?: number;
        maxlength?: number;
        bold?: boolean;
        color?: string;
    }

    let {
        onBeforeInput,
        placeholder,
        value = $bindable(""),
        onInput,
        size = 5,
        maxlength,
        bold = false,
        color,
    }: Props = $props();

    let inputEl: HTMLElement;
    function adjust(event: Event) {
        onInput?.(event);
    }

    function adjustWidth() {
        if (inputEl) {
            inputEl.style.width = "auto";
            inputEl.style.width = inputEl.scrollWidth + 1 + "px";
        }
    }
    onMount(adjustWidth);
    $effect(() => {
        value;
        adjustWidth();
    });
</script>

<input
    bind:value
    bind:this={inputEl}
    {size}
    {maxlength}
    oninput={adjust}
    onbeforeinput={onBeforeInput}
    style:font-weight={bold ? "700" : "inherit"}
    style:--theme={color}
    {placeholder}
/>

<style>
    input {
        font-size: 1rem;
        color: var(--theme);
        background-color: transparent;
        border: none;
    }
</style>
