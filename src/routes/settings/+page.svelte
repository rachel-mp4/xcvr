<script lang="ts">
  import { browser } from "$app/environment";
  const defaulttheme = "dark";
  const initialtheme = browser
    ? (window.localStorage.getItem("theme") ?? defaulttheme)
    : defaulttheme;
  let themebool = $state(initialtheme === "light");
  let theme = $derived(themebool ? "light" : "dark");
  $effect(() => {
    if (theme) {
      window.localStorage.setItem("theme", theme);
    }
  });
  // i think that i need to use writable or something to coordinate with the layout,
  // but i just wanna see if this works for now without showing the changes immediately
</script>

<main>
  <div>light theme</div>
  <input type="checkbox" bind:checked={themebool} />
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
