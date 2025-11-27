<script lang="ts">
  let title = $state("");
  let topic = $state("");
  let host = $state("did:web:xcvr.org");
  const graphemes = (text: string) => {
    if (Intl.Segmenter) {
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
      return Array.from(segmenter.segment(text)).length;
    }
    return [...text].length;
  };
  let titleGraphemes = $derived(graphemes(title));
  let titleValid = $derived(titleGraphemes <= 64 && title.length <= 640);
  let topicGraphemes = $derived(graphemes(topic));
  let topicValid = $derived(topicGraphemes <= 256 && topic.length <= 2560);
  let hostValid = $derived(host.length <= 253);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/lrc/channel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          topic: topic,
          host: host,
        }),
      },
    );
    if (response.ok) {
      window.location.href = response.url;
    } else {
      console.error("request failed");
    }
  };
</script>

<main>
  <p>
    make a channel! if you're logged in, it will be yours, if you're not, it
    will be xcvr's
  </p>
  <form onsubmit={handleSubmit}>
    <div class="beeper {titleValid ? 'valid' : ''}">
      <label for="title">
        this is the channel title, give it a short name!
      </label>
      <input
        type="text"
        name="title"
        placeholder="channel_title"
        bind:value={title}
        required
      />
    </div>
    <div class="beeper {topicValid ? 'valid' : ''}">
      <label for="topic">
        this is the channel topic, give it a shortish topic if you'd like!
      </label>
      <input
        type="text"
        name="topic"
        placeholder="channel_topic"
        bind:value={topic}
      />
    </div>
    <div class="beeper {hostValid ? 'valid' : ''}">
      <label for="host">
        this is the channel host. you can put whatever you want here, but if the
        given did does not host xcvr channels, or if they do but they don't like
        you in particular, then your channel will not exactly "work." freedom of
        speech, but not a right to a platform. likely just leave it as
        did:web:xcvr.org as of nov 26 2025
      </label>
      <input
        type="text"
        name="host"
        placeholder="channel_host"
        bind:value={host}
        required
      />
    </div>
    <div>
      <input
        class="beep"
        type="submit"
        value="i'd like to make this channel"
        disabled={!titleValid || !topicValid || !hostValid}
      />
    </div>
  </form>
</main>

<style>
  form {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    font-size: 2rem;
    gap: 1rem;
  }
  form > div > * {
    display: block;
  }
  label {
    font-size: 1.5rem;
  }
  input {
    font-size: inherit;
    background: var(--fg);
    border-radius: 0;
    border: 0;
    padding: 0;
  }
  .beeper.valid::after {
    content: "ok!";
    font-size: 1.5rem;
    display: block;
  }
  .beeper::after {
    content: "not ok! (too long)";
  }

  .beep {
    background: none;
    color: var(--fg);
  }
  .beep:hover {
    font-weight: 700;
    cursor: pointer;
  }
</style>
