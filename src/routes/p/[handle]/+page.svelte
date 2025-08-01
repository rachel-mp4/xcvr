<script lang="ts">
  import type { PageProps } from "./$types";
  import { numToHex, hexToNum, hexToContrast } from "$lib/colors";
  import { browser } from "$app/environment";
  let { data }: PageProps = $props();
  const graphemes = (text: string) => {
    if (Intl.Segmenter) {
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
      return Array.from(segmenter.segment(text)).length;
    }
    return [...text].length;
  };
  let editedProfile = $state({
    displayName: "",
    defaultNick: "",
    status: "",
    color: numToHex(0),
  });
  $effect(() => {
    if (data.profile) {
      editedProfile.displayName = data.profile?.displayName || "";
      editedProfile.defaultNick = data.profile?.defaultNick || "";
      editedProfile.status = data.profile?.status || "";
      editedProfile.color = numToHex(data.profile?.color) || numToHex(0);
    }
  });
  const colorasint = $derived(hexToNum(editedProfile.color));
  const displayNameGraphemes = $derived(graphemes(editedProfile.displayName));
  const statusGraphemes = $derived(graphemes(editedProfile.status));
  const dnchanged = $derived(
    editedProfile.displayName !== data.profile.displayName,
  );
  const nickchanged = $derived(
    editedProfile.defaultNick !== data.profile.defaultNick,
  );
  const statuschanged = $derived(editedProfile.status !== data.profile.status);

  const displayNameValid = $derived(
    displayNameGraphemes <= 64 && editedProfile.displayName.length <= 640,
  );
  const nickValid = $derived(editedProfile.defaultNick.length <= 16);
  const statusValid = $derived(
    statusGraphemes <= 300 && editedProfile.status.length <= 3000,
  );
  $effect(() => {
    if (browser) {
      document.documentElement.style.setProperty("--bg", editedProfile.color);
      document.documentElement.style.setProperty(
        "--fg",
        hexToContrast(editedProfile.color),
      );
      document.documentElement.style.setProperty(
        "--fl",
        hexToContrast(editedProfile.color) + "80",
      );
      document.documentElement.style.setProperty(
        "--bl",
        editedProfile.color + "80",
      );
    }
  });
  $effect(() => {
    return () => {
      if (browser) {
        document.documentElement.style.removeProperty("--bg");
        document.documentElement.style.removeProperty("--fg");
        document.documentElement.style.removeProperty("--fl");
        document.documentElement.style.removeProperty("--bl");
      }
    };
  });
  let currentlySubmitting = $state(false);
  let submitState = $state("pre");
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (currentlySubmitting) {
      return;
    }
    try {
      currentlySubmitting = true;
      submitState = "pre";
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/xcvr/profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            displayName: editedProfile.displayName,
            defaultNick: editedProfile.defaultNick,
            status: editedProfile.status,
            color: colorasint,
          }),
        },
      );
      if (!response.ok) {
        throw Error;
      }
      submitState = "success";
    } catch {
      submitState = "fail";
    } finally {
      currentlySubmitting = false;
    }
  };
  let beep = $state("");
  let beeping = $state(false);
  const handleBeep = async (e: Event) => {
    e.preventDefault();
    if (beeping) {
      return;
    }
    const endpoint = `${import.meta.env.VITE_API_URL}/xcvr/beep`;
    try {
      beeping = true;
      const response = await fetch(endpoint, { method: "POST" });
      if (!response.ok) {
        throw Error;
      }
      beep += "beep_";
    } catch {
    } finally {
      beeping = false;
    }
  };
</script>

<main>
  {#if data.profile}
    <h1 class="display name">
      {editedProfile.displayName}
    </h1>
    <h2 class="display handle">
      {editedProfile.defaultNick}@<a href="https://{data.profile.handle}">
        {data.profile.handle}
      </a>
    </h2>
    <p class="status">
      {editedProfile.status}
    </p>
  {/if}
  {#if data.lastSeen}
    last seen {#if data.lastSeen.where}
      {data.lastSeen.where}
    {/if}
    {#if data.lastSeen.when}
      {data.lastSeen.when}
    {/if}
  {/if}
</main>

{#if data?.myProfile?.handle && data?.profile?.handle && data.myProfile.handle === data.profile.handle && data.myProfile.loggedIn}
  <aside>
    <p>
      you can change your profile here, press the i'm done button when you have
      finished to save your new profile
    </p>
    <form class="profile-form" onsubmit={handleSubmit}>
      <div
        class="display-name {dnchanged ? 'changed' : ''} {displayNameValid
          ? 'valid'
          : ''}"
      >
        <label for="displayName">
          display name, this is what shows in most atproto stuff
        </label>
        <input
          type="text"
          name="displayName"
          placeholder="alice rulez"
          maxlength="640"
          bind:value={editedProfile.displayName}
          required
        />
      </div>
      <div
        class="default-nick {nickchanged ? 'changed' : ''} {nickValid
          ? 'valid'
          : ''}"
      >
        <label for="defaultNick">
          default nickname, which is what shows just in the lrc chats by default
        </label>
        <input
          type="text"
          name="defaultNick"
          placeholder="alice"
          bind:value={editedProfile.defaultNick}
          required
        />
      </div>
      <div
        class="{statuschanged ? 'changed' : ''} {statusValid ? 'valid' : ''}"
      >
        <label for="status">
          this is your status / bio, you can put extra stuff here if you'd like
          to share more about yourself
        </label>
        <textarea
          name="status"
          placeholder="hi i'm alice"
          bind:value={editedProfile.status}
          required
        ></textarea>
      </div>
      <div>
        <label for="color">
          this is your accent color, make sure to pick something cool and trendy
          to drive your personal brand awareness
        </label>
        <input type="color" bind:value={editedProfile.color} />
        <input type="hidden" name="color" value={colorasint} />
      </div>
      <div>
        <input
          style:margin-top="1rem"
          type="submit"
          value="i'm done"
          disabled={!nickValid || !displayNameValid || !statusValid}
        />
      </div>
      {#if currentlySubmitting}
        <div>submitting...</div>
      {:else if submitState !== "pre"}
        <div>
          {submitState}
        </div>
      {/if}
    </form>

    <form
      action="{import.meta.env.VITE_API_URL}/xcvr/beep"
      method="POST"
      onsubmit={handleBeep}
      style:margin-top="4rem"
    >
      <label for="submit"> (i just post beep on your twitter) </label>
      <input type="submit" value="push_to_beep_" />
      {#if beep !== ""}
        {beep}
      {/if}
    </form>
    <form
      action="{import.meta.env.VITE_API_URL}/oauth/logout"
      method="POST"
      style:margin-top="2rem"
    >
      <input type="submit" value="log out" />
    </form>
  </aside>
{/if}

<style>
  .changed.valid::after {
    content: "ok!";
  }
  .changed::after {
    content: "NOT OK! (too long)";
  }
  form input {
    padding: 0;
    font-size: 1.5rem;
    width: 100%;
  }
  form textarea {
    padding: 0;
    border: none;
    width: 100%;
    height: 9rem;
  }
  .profile-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .handle {
    font-size: 2rem;
    font-weight: 400;
  }
  .handle a {
    display: inline;
  }
  .profile-form > * > * {
    display: block;
  }
  .name {
    font-size: 4rem;
  }
  .status {
    white-space: pre-wrap;
  }
</style>
