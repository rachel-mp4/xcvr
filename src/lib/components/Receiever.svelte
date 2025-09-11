<script lang="ts">
  import Transmission from "$lib/components/Transmission.svelte";
  import type { Message, Image, Item } from "$lib/types";
  import { isMessage, isImage } from "$lib/types";
  import type { Action } from "svelte/action";
  interface Props {
    items: Array<Item>;
    mylocaltext?: string;
    onmute?: (id: number) => void;
    onunmute?: (id: number) => void;
  }
  let { items, mylocaltext, onmute, onunmute }: Props = $props();
  let length = $derived(items.length);
  let innerWidth = $state(0);
  let isDesktop = $derived(innerWidth > 1000);
  const attachImage: Action<HTMLDivElement, HTMLImageElement | undefined> = (
    node,
    img,
  ) => {
    $effect(() => {
      if (img != null) node.appendChild(img);
      node.innerText = "bebebe";
      return () => {
        if (img != null) node.removeChild(img);
      };
    });
  };
</script>

<svelte:window bind:innerWidth />
<div id="receiver">
  {#each items as item, index}
    {@const last = length - 1}
    {@const diff = last - index}
    {@const guess = 2 + (Math.atan((diff - 19) * 0.25) / -2.8 - 0.45)}
    {@const res = Math.min(Math.max(guess, 1), 2)}
    {#if isMessage(item)}
      <Transmission
        message={item}
        mylocaltext={item.active && item.mine ? mylocaltext : undefined}
        margin={0}
        {onmute}
        {onunmute}
        fs={isDesktop ? `${res}rem` : "1rem"}
      />
    {:else if isImage(item)}
      <div use:attachImage={item.image}>beep</div>
    {/if}
  {/each}
</div>

<style>
  #receiver {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
</style>
