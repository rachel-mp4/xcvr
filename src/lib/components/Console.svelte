<script lang="ts">
  import type { LogItem } from "$lib/types";
  interface Props {
    log: Array<LogItem>;
  }
  let { log }: Props = $props();
  const randPosition = (l: LogItem): string => {
    const top =
      Math.abs(Math.sin(l.id * l.id * 11.11) % 1) * 95 +
      4 * (Math.sin(l.time * 7.7) % 1);
    const left =
      Math.abs(Math.sin(l.id * l.id * 22.22) % 1) * 90 +
      5 * (Math.sin(l.time * 14.14) % 1);
    return `top: ${top}%; left: ${left}%`;
  };
</script>

{#each log as logitem}
  <span style={randPosition(logitem)} class="logitem {logitem.type}">
    0x{logitem.binary}
  </span>
{/each}

<style>
  .logitem {
    position: absolute;
    pointer-events: none;
    line-height: 1;
    animation: 3s ease-out fadeout;
  }

  @keyframes fadeout {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  .delete {
    background-color: #034732;
  }
  .insert {
    background-color: #008148;
  }
  .pub {
    background-color: #c6c013;
  }
  .init {
    background-color: #ef8a17;
  }
</style>
