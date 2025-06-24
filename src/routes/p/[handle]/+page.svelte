<script lang="ts">
  import type { PageProps } from "./$types";
  import { numToHex } from "$lib/colors";
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
    color: 0,
  });
  $effect(() => {
    if (data.profile) {
      editedProfile.displayName = data.profile?.displayName || "";
      editedProfile.defaultNick = data.profile?.defaultNick || "";
      editedProfile.status = data.profile?.status || "";
      editedProfile.color = data.profile?.color || 0;
    }
  });
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
</script>

<main>
  {#if data.profile}
    <h1 class="display name">
      {editedProfile.displayName}
    </h1>
    <h2 class="display handle">
      {data.profile.defaultNick}@<a href="https://{data.profile.handle}">
        {data.profile.handle}
      </a>
    </h2>
    <p>
      {editedProfile.status}
    </p>
  {/if}
</main>
{#if data?.id?.handle && data?.profile?.handle && data.id.handle === data.profile.handle}
  <aside>
    <p>
      you can change your profile here, press the i'm done button when you have
      finished to save your new profile
    </p>
    <form
      class="profile-form"
      action="{import.meta.env.VITE_API_URL}/oauth/login"
      method="POST"
    >
      <div
        class="display-name {dnchanged ? 'changed' : ''} {displayNameValid ? 'valid' : ''}"
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
      <div class="default-nick {nickchanged ? 'changed' : ''} {nickValid ? 'valid' : ''}">
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
        <input
          type="color"
          name="color"
          value={numToHex(data.profile?.color)}
        />
      </div>
    </form>
  </aside>
{/if}

<style>
  .changed.valid::after {
    content: "ok!";
  }
  .changed::after {
    content: "not ok!";
  }
  form .display-name {
    font-size:2rem;
  }
  .profile-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .handle {
    font-size: 2rem;
    font-weight:400;
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
  h2 {
    margin: 0;
  }
</style>
