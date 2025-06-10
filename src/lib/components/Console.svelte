<script lang="ts">
  import type { LogItem } from "$lib/types";
  interface Props {
    log: Array<LogItem>;
  }
  let { log }: Props = $props();
</script>

{#each log as logitem}
  <span class="logitem {logitem.color}">
    {logitem.binary}
  </span>
{/each}

<style>
  .logitem {
    font-family: "Courier New";
    line-height: 1;
    color: #e8ded3;
  }
  .delete {
    background-color: #034732;
  }
  .insert {
    background-color: #008148;
  }
  .pub {
    background-color: #C6C013;
  }
  .init {
    background-color: #EF8A17;
  }
</style>
