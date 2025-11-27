<script lang="ts">
  import MessageTransmission from "$lib/components/MessageTransmission.svelte";
  import type { SignedItemView } from "$lib/types";
  import {
    signedImageViewToImage,
    signedMessageViewToMessage,
  } from "$lib/utils";
  import ImageTransmission from "./ImageTransmission.svelte";
  interface Props {
    items: Array<SignedItemView>;
  }
  let { items }: Props = $props();
</script>

<div id="receiver">
  {#each [...items].reverse() as item, i}
    {i}
    {#if item.type === "message"}
      <MessageTransmission
        message={signedMessageViewToMessage(item)}
        margin={0}
      />
    {/if}
    {#if item.type === "image"}
      <ImageTransmission image={signedImageViewToImage(item)} margin={0} />
    {/if}
  {/each}
</div>

<style>
  #receiver {
    width: 100%;
  }
</style>
