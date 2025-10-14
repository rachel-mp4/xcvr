<script lang="ts">
    import type { Image } from "$lib/types";
    import { computePosition, flip, shift, offset } from "@floating-ui/dom";
    import { hexToContrast, hexToTransparent, numToHex } from "$lib/colors";
    import { smartAbsoluteTimestamp, dumbAbsoluteTimestamp } from "$lib/utils";
    import ProfileCard from "./ProfileCard.svelte";
    interface Props {
        image: Image;
        margin: number;
        onmute?: (id: number) => void;
        onunmute?: (id: number) => void;
        fs?: string;
    }
    let { image, margin, onmute, onunmute, fs }: Props = $props();
    let color: string = numToHex(image.color ?? 16777215);
    let cpartial: string = hexToTransparent(color);
    let contrast: string = hexToContrast(color);
    let partial: string = hexToTransparent(contrast);
    let triggerEl: HTMLElement | undefined = $state();
    let profileEl: HTMLElement | undefined = $state();
    let showProfile = $state(false);
    async function updatePosition() {
        if (triggerEl && profileEl) {
            const { x, y } = await computePosition(triggerEl, profileEl, {
                middleware: [offset(0), flip(), shift()],
            });
            Object.assign(profileEl.style, {
                left: `${x}px`,
                top: `${y}px`,
            });
        }
    }
    $effect(() => {
        if (showProfile) {
            updatePosition();
        }
    });
    let pinned = $state(false);
</script>

{#if image.muted === false}
    <div
        style:--theme={color}
        style:--themep={cpartial}
        style:--tcontrast={contrast}
        style:--tpartial={partial}
        style:--margin={margin + "rem"}
        style:--size={fs ?? "1rem"}
        class="{image.active ? 'active' : ''} 
    {image.profileView ? 'signed' : ''} 
    {pinned ? 'pinned' : ''} 
    {image.nick ? '' : 'late'} 
    imageTransmission"
    >
        <div class="header">
            <span class="nick">{image.nick ?? "???"}</span
            >{#if image.handle}{#if !image.profileView}<span class="handle"
                        >@{image.handle}</span
                    >{:else}<div
                        role="button"
                        tabindex="0"
                        class="handle-container"
                        onmouseenter={() => (showProfile = true)}
                        onmouseleave={() => (showProfile = false)}
                    >
                        <a
                            bind:this={triggerEl}
                            class="handle"
                            href={`/p/${image.handle}`}>@{image.handle}</a
                        >
                        {#if showProfile}
                            <div
                                class="profile-container"
                                bind:this={profileEl}
                            >
                                <ProfileCard profile={image.profileView} />
                            </div>
                        {/if}
                    </div>
                {/if}
                <span
                    class="time clickable"
                    title={dumbAbsoluteTimestamp(image.startedAt)}
                >
                    {smartAbsoluteTimestamp(image.startedAt)}
                </span>
                <button
                    class="clickable"
                    onclick={() => {
                        pinned = !pinned;
                    }}
                >
                    {pinned ? "unpin" : "pin"}
                </button>
                {#if image.mine !== true}
                    <button
                        class="mute clickable"
                        onclick={() => {
                            image.muted = true;
                            onmute?.(image.id);
                        }}
                    >
                        mute
                    </button>
                {/if}
            {/if}
        </div>
        {#if image.src || image.msrc}
            <div class="image-wrapper">
                <img
                    class="bg-img"
                    src={image.msrc ? image.msrc : image.src}
                    alt={image.alt}
                />
                <img
                    class="fg-img"
                    src={image.msrc ? image.msrc : image.src}
                    alt={image.alt}
                />
            </div>
        {:else}
            i don't have an image yet
        {/if}
    </div>
{:else}
    muted.
    <button
        class="unmute"
        onclick={() => {
            image.muted = false;
            onunmute?.(image.id);
        }}
    >
        unmute
    </button>
{/if}

<style>
    .active {
        position: relative;
        background-color: var(--themep);
        color: var(--tcontrast);
    }
    .active::before {
        position: absolute;
        content: "";
        inset: 0;
        z-index: -1;
        background-color: var(--theme);
    }
    .imageTransmission:not(:hover) .clickable {
        display: none;
    }
    .active .clickable {
        color: var(--tpartial);
    }
    .clickable {
        color: var(--fl);
        cursor: pointer;
    }
    .clickable:hover {
        color: var(--fg);
    }
    .active .clickable:hover {
        color: var(--contrast);
    }
    .pinned {
        order: 1;
    }

    .header {
        font-weight: 700;
    }
    .active .handle {
        color: var(--tpartial);
    }
    .active.signed .handle {
        color: var(--tcontrast);
    }
    .active a {
        color: var(--tcontrast);
    }
    .signed .handle {
        color: var(--fg);
    }
    .handle {
        color: var(--fl);
        position: relative;
    }

    .nick {
        white-space: pre-wrap;
    }

    .handle::after {
        content: "";
        color: var(--fg);
        background: var(--bg);
        position: absolute;
        left: 0;
        right: 0;
        top: calc(55% - calc(var(--size) / 8));
        bottom: calc(45% - calc(var(--size) / 8));
        transform: scaleX(0);
        transform-origin: center left;
        transition: transform 0.17s 3s;
    }

    .imageTransmission:not(.signed):not(.active) .handle::after {
        transform: scaleX(1);
    }
    .imageTransmission:not(.signed):not(.active) .handle:hover::after {
        content: "i couldn't find a record :c";
    }

    .imageTransmission {
        padding-bottom: 1rem;
        margin-top: var(--margin);
        font-size: var(--size);
    }

    .imageTransmission:not(.active) .header {
        color: var(--theme);
    }
    .profile-container {
        position: absolute;
        z-index: 1;
    }
    .handle-container {
        display: inline-block;
        color: var(--fg);
    }
    button {
        font-size: var(--size);
        background-color: transparent;
        border: none;
        color: var(--fg);
        padding: 0;
        cursor: pointer;
    }
    button:hover {
        font-weight: 700;
    }
    .image-wrapper {
        position: relative;
    }
    .image-wrapper .bg-img {
        position: absolute;
        z-index: -1;
    }
    .image-wrapper .fg-img {
        position: relative;
        opacity: 0.5;
    }
</style>
