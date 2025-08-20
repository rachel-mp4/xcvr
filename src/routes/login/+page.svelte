<script lang="ts">
  import { sanitizeHandle } from "$lib/utils";
  function handleSubmit(event: SubmitEvent) {
    const inputel = document.querySelector(".beep")
    if (inputel instanceof HTMLInputElement) {
      inputel.value = sanitizeHandle(inputel.value)
    }
  }
</script>
<main>
  <p>
    xcvr uses atproto oauth, so enter your atproto handle below (if on bsky you
    are Jay 🦋@jay.bsky.team, then you'd enter "jay.bsky.team" without the
    quotes), and then i'll look up your personal data server, and direct you to
    your login page with them. i won't even get a sniff of your password,
    instead they will instead send me a temporary key instead which lets me add
    or subtract stuff from your account respository.
  </p>
  <p class="big" style="margin-top:1rem">your handle goes there
     |   |                      |
    V  V                    V    </p>
  <form action="{import.meta.env.VITE_API_URL}/oauth/login" onsubmit={handleSubmit} method="POST">
    <input
      type="text"
      name="identifier"
      id="identifier"
      placeholder="alice.com"
      required
    />
    &lt;—
    <input class="beep" type="submit" value="this is my handle" />
  </form>
  <p class="big">yup...       ^       ^                                   ^
               │     │                                 │
               │     └  that's your handle│
               │            alright...                 │
               │                                          │
               │                                      ┌┘
               │                           click that "this is my handle"
               └────when that handle is your handle
  </p>
  <p class="snirp">
    if all this oauth stuff is a bit too intimidating or you don't have an
    atproto account (currently you can only get one through bluesky) remember
    that you don't need to login to use xcvr!
  </p>
</main>

<style>
  .big {
    font-size: 2rem;
    white-space: pre-wrap;
    line-height: 1;
  }
  form {
    font-size: 2rem;
  }
  input {
    font-size: inherit;
    background: var(--fg);
    border-radius: 0;
    border: 0;
    padding: 0;
  }
  .beep {
    background: none;
    color: var(--fg);
  }
  .beep:hover {
    font-weight: 700;
    cursor: pointer;
  }
  .snirp {
    margin-top: 1rem;
  }
</style>
