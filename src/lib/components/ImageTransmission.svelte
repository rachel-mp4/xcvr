<script lang="ts">
    import type { Image } from "$lib/types";
    import { computePosition, flip, shift, offset } from "@floating-ui/dom";
    import { colorSetFromTheme, type ColorSet } from "$lib/colors";
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
    let protocol: string = $state(image.mediaView ? "atp" : "lrc");
    let canatp: boolean = $derived(image.mediaView !== undefined);
    let canlrc: boolean = $derived(
        image.lrcdata.init !== undefined || image.lrcdata.pub !== undefined,
    );
    let nick: string | undefined = $derived(
        protocol === "atp" ? image.mediaView?.nick : image.lrcdata.init?.nick,
    );
    let handle: string | undefined = $derived(
        protocol === "atp"
            ? image.mediaView?.author.handle
            : image.lrcdata.init?.handle,
    );
    let color: number | undefined = $derived(
        protocol === "atp"
            ? (image.mediaView?.color ?? image.mediaView?.author.color)
            : image.lrcdata.init?.color,
    );
    let colorSet: ColorSet = $derived(colorSetFromTheme(color ?? 8421504));
    let src: string | undefined = $derived(
        protocol === "atp"
            ? image.mediaView?.imageView?.src
            : image.lrcdata.pub?.contentAddress,
    );
    $effect(() => console.log(src));
    let alt: string | undefined = $derived(
        protocol === "atp"
            ? image.mediaView?.imageView?.alt
            : image.lrcdata.pub?.alt,
    );
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

{#if image.lrcdata.muted === false}
    <div
        style:--theme={colorSet.theme}
        style:--themep={colorSet.themetransparent}
        style:--tcontrast={colorSet.themecontrast}
        style:--tpartial={colorSet.themecontrasttransparent}
        style:--margin={margin + "rem"}
        style:--size={fs ?? "1rem"}
        class="{image.lrcdata.pub || image.mediaView ? '' : 'active'} 
    {image.mediaView ? 'signed' : ''} 
    {pinned ? 'pinned' : ''} 
    {image.lrcdata.init ? '' : 'late'} 
    imageTransmission"
    >
        <div class="header">
            <span class="nick">{nick ?? ""}</span>{#if handle !== undefined}
                {#if !image.mediaView?.author}<span class="handle"
                        >@{handle}</span
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
                            href={`/p/${handle}`}>@{handle}</a
                        >
                        {#if showProfile}
                            <div
                                class="profile-container"
                                bind:this={profileEl}
                            >
                                <ProfileCard profile={image.mediaView.author} />
                            </div>
                        {/if}
                    </div>
                {/if}
                {#if protocol === "atp"}
                    {#if canlrc}
                        <button
                            class="clickable"
                            onclick={() => {
                                protocol = "lrc";
                            }}
                        >
                            atproto, switch to lrc
                        </button>
                    {:else}
                        <span class="clickable">atproto</span>
                    {/if}
                {:else if canatp}
                    <button
                        class="clickable"
                        onclick={() => (protocol = "atp")}
                    >
                        lrc, switch to atproto
                    </button>
                {:else}
                    <span class="clickable">lrc</span>
                {/if}
                {#if image.signetView?.startedAt}
                    <span
                        class="time clickable"
                        title={dumbAbsoluteTimestamp(
                            Date.parse(image.signetView.startedAt),
                        )}
                    >
                        {smartAbsoluteTimestamp(
                            Date.parse(image.signetView.startedAt),
                        )}
                    </span>
                {/if}
                <button
                    class="clickable"
                    onclick={() => {
                        pinned = !pinned;
                    }}
                >
                    {pinned ? "unpin" : "pin"}
                </button>
                {#if image.lrcdata.mine !== true}
                    <button
                        class="mute clickable"
                        onclick={() => {
                            image.lrcdata.mine = true;
                            onmute?.(image.id);
                        }}
                    >
                        mute
                    </button>
                {/if}
            {/if}
        </div>
        {#if src}
            <div class="image-wrapper">
                <img class="bg-img" {src} {alt} />
                <img class="fg-img" {src} {alt} />
            </div>
        {:else}
            i don't have an image yet {image.mediaView?.imageView?.src ??
                "noper"}
        {/if}
    </div>
{:else}
    muted.
    <button
        class="unmute"
        onclick={() => {
            image.lrcdata.muted = false;
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
