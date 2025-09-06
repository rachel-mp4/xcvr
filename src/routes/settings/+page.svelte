<script lang="ts">
  import { browser } from "$app/environment";
  import { getContext } from "svelte";
  const defaulttheme = "dark";
  const initialtheme = browser
    ? (window.localStorage.getItem("theme") ?? defaulttheme)
    : defaulttheme;
  let themebool = $state(initialtheme === "light");
  let theme = $derived(themebool ? "light" : "dark");
  $effect(() => {
    if (theme) {
      window.localStorage.setItem("theme", theme);
      if (theme === "light") {
        themeContext.setLight();
      }
      if (theme === "dark") {
        themeContext.setDark();
      }
    }
  });
  const themeContext = getContext<{
    curTheme: string;
    setLight: () => void;
    setDark: () => void;
  }>("theme");
  const cursorContext = getContext<{
    cursor: boolean;
    setCursorTrue: () => void;
    setCursorFalse: () => void;
  }>("cursor");
  const defaultCursor = "t";
  const initialCursor = browser
    ? (window.localStorage.getItem("cursor") ?? defaultCursor)
    : defaultCursor;
  let cursor = $state(initialCursor === "t");
  $effect(() => {
    if (cursor !== undefined) {
      window.localStorage.setItem("cursor", cursor ? "t" : "f");
      if (cursor) {
        cursorContext.setCursorTrue();
      } else {
        cursorContext.setCursorFalse();
      }
    }
  });
</script>

<main>
  <div>light theme</div>
  <input type="checkbox" bind:checked={themebool} />
  <div>fun cursor trail</div>
  <input type="checkbox" bind:checked={cursor} />
  <form action="{import.meta.env.VITE_API_URL}/oauth/logout" method="POST">
    <input type="submit" value="log out" />
  </form>
</main>

<style>
  input {
    padding: 0;
    background: var(--fg);
    color: var(--bg);
    font-size: 2rem;
  }
</style>
