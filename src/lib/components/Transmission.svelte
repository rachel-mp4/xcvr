<script lang="ts">
    import type { Message } from "$lib/types";
    import * as linkify from "linkifyjs";
    import { computePosition, flip, shift, offset } from "@floating-ui/dom";
    import { hexToContrast, hexToTransparent, numToHex } from "$lib/colors";
    import { smartAbsoluteTimestamp, dumbAbsoluteTimestamp } from "$lib/utils";
    import ProfileCard from "./ProfileCard.svelte";
    import diff from "fast-diff";
    interface Props {
        message: Message;
        margin: number;
        mylocaltext?: string;
        onmute?: (id: number) => void;
        onunmute?: (id: number) => void;
    }
    let { message, margin, mylocaltext, onmute, onunmute }: Props = $props();
    let color: string = numToHex(message.color ?? 16777215);
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
    const escapeHTML = (text: string): string => {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    };
    let canshownotlrc = $derived(
        message.mbody !== undefined && message.mbody !== message.body,
    );
    let showinglrc = $state(message.mbody !== undefined);
    const convertLinksToMessageFrags = (body: string) => {
        const ebody = escapeHTML(body);
        const links = linkify.find(body, "url");
        const ll = links.length;
        if (ll === 0) {
            return [{ text: ebody, isLink: false, href: "", key: 0 }];
        }
        let res = [];
        let idx = 0;
        links.forEach((link) => {
            if (link.start > idx) {
                const beforeText = body.substring(idx, link.start);
                res.push({
                    text: escapeHTML(beforeText),
                    isLink: false,
                    href: "",
                    key: res.length,
                });
            }
            res.push({
                text: link.value,
                href: link.href,
                isLink: true,
                key: res.length,
            });
            idx = link.end;
        });
        if (idx < body.length) {
            const afterText = body.substring(idx);
            res.push({
                text: escapeHTML(afterText),
                isLink: false,
                key: res.length,
                href: "",
            });
        }
        return res;
    };
    let mfrags = $derived(
        convertLinksToMessageFrags(
            showinglrc ? message.body : (message.mbody ?? message.body),
        ),
    );
    let diffs = $derived(
        message.active && message.mine && mylocaltext
            ? diff(message.body, mylocaltext)
            : null,
    );
    let pinned = $state(false);
</script>

{#if message.muted === false}
    <div
        style:--theme={color}
        style:--themep={cpartial}
        style:--tcontrast={contrast}
        style:--tpartial={partial}
        style:--margin={margin + "rem"}
        class="{message.active ? 'active' : ''} 
    {message.profileView ? 'signed' : ''} 
    {pinned ? 'pinned' : ''} 
    {message.nick ? '' : 'late'} 
    transmission"
    >
        <div class="header">
            <span class="nick">{message.nick ?? "???"}</span>
            {#if message.handle}
                {#if !message.profileView}
                    <span class="handle">
                        @{message.handle}
                    </span>
                {:else}
                    <div
                        role="button"
                        tabindex="0"
                        class="handle-container"
                        onmouseenter={() => (showProfile = true)}
                        onmouseleave={() => (showProfile = false)}
                    >
                        <a
                            bind:this={triggerEl}
                            class="handle"
                            href={`/p/${message.handle}`}
                            >@{message.handle}
                        </a>
                        {#if showProfile}
                            <div
                                class="profile-container"
                                bind:this={profileEl}
                            >
                                <ProfileCard profile={message.profileView} />
                            </div>
                        {/if}
                    </div>
                {/if}
                <span
                    class="time clickable"
                    title={dumbAbsoluteTimestamp(message.startedAt)}
                >
                    {smartAbsoluteTimestamp(message.startedAt)}
                </span>
                <button
                    class="clickable"
                    onclick={() => {
                        pinned = !pinned;
                    }}
                >
                    {pinned ? "unpin" : "pin"}
                </button>
                <button
                    class="mute clickable"
                    onclick={() => {
                        message.muted = true;
                        onmute?.(message.id);
                    }}
                >
                    mute
                </button>
                {#if canshownotlrc}<span class="clickable"
                        ><button
                            onclick={() => {
                                showinglrc = !showinglrc;
                            }}
                            >{showinglrc
                                ? "go back to atproto"
                                : "I WAS THERE!"}</button
                        > (difference between atproto + lrc detected)</span
                    >{/if}
            {/if}
        </div>
        <div class="body">
            {#if diffs}
                {#each diffs as diff}
                    {#if diff[0] === -1}
                        <span class="removed">{diff[1]}</span>
                    {:else if diff[0] === 0}
                        <span>{diff[1]}</span>
                    {:else}
                        <span class="appended">{diff[1]}</span>
                    {/if}
                {/each}
            {:else}
                {#each mfrags as part (part.key)}
                    {#if part.isLink}
                        <a href={part.href} target="_blank" rel="noopener"
                            >{part.text}</a
                        >
                    {:else}
                        {@html part.text}
                    {/if}
                {/each}
            {/if}
        </div>
    </div>
{:else}
    muted.
    <button
        class="unmute"
        onclick={() => {
            message.muted = false;
            onunmute?.(message.id);
        }}
    >
        unmute
    </button>
{/if}

<style>
    .late {
        filter: url("#pearly");
    }
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
    .removed {
        text-decoration: line-through var(--tpartial);
    }
    .appended {
        color: var(--tpartial);
    }
    .transmission:not(:hover) .clickable {
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

    .handle::after {
        content: "";
        color: var(--fg);
        background: var(--bg);
        position: absolute;
        left: 0;
        right: 0;
        top: calc(55% - 0.125rem);
        bottom: calc(45% - 0.125rem);
        transform: scaleX(0);
        transform-origin: center left;
        transition: transform 0.17s 3s;
    }

    .transmission:not(.signed):not(.active) .handle::after {
        transform: scaleX(1);
    }
    .transmission:not(.signed):not(.active) .handle:hover::after {
        content: "i couldn't find a record :c";
    }

    .transmission {
        padding-bottom: 1rem;
        margin-top: var(--margin);
    }

    .transmission:not(.active) .header {
        color: var(--theme);
        text-shadow: 0 0 1rem var(--fl);
    }
    .body {
        white-space: pre-wrap;
        word-wrap: break-word;
        max-width: 100%;
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
        font-size: 1rem;
        background-color: transparent;
        border: none;
        color: var(--fg);
        padding: 0;
        cursor: pointer;
    }
    button:hover {
        font-weight: 700;
    }
</style>
