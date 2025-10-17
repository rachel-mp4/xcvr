<main>
  <h2>short term TODO</h2>
  <p>ability to load media in history</p>
  <p>improve user interface for image upload</p>
  <p>improve mobile site a hair</p>
  <p>notification volume settings</p>
  <p>improve color scheme settings</p>
  <p>link to records for nerds</p>
  <p>research facet lexicon</p>

  <h2>known bugs</h2>
  <p>
    <b> inability to validate messages </b> occurs at some points in time,
    possibly after the backend restarts, but i'm not totally sure how or why,
    oauth is a bit mysterious to me still and it's likely a silly error
    somewhere but if you suddenly are unable to make any records while logged
    in, then you should log out and log back in
    <s>
      i actually believe that this should be fixed now! please let me know if
      it's funky
    </s> <s> it was not fixed </s> IT MIGHT NOW BE FIXED
  </p>
  <p>
    this isn't a serious bug but <b> color theming for user profiles </b> seems broken
    right now, woops!
  </p>
  <p>
    <b>after 200 messages colors and metadata swap around,</b> i believe. i'm
    not entirely sure what's the vibe NGL but it's been an issue for a long
    time, only just now (sep 9 2025) logging it. kinda serious, but not sure how
    to diagnose it, i'm sure it's just a line or 2 in wscontext.svelte.ts but
    that file is a bit chaotic haha, written in a few frenzies, should be
    refactored at some point lol and i'm sure the issue will disappear back into
    nothingness
    <b>update october 16 2025, did some stuff & hopefully it should be better</b
    >
  </p>
  <h2>upcoming features</h2>
  <p>
    <s
      ><b>:emoji: with tab autocomplete</b> is a feature that i really miss from
      discord :/ this should be come sooner.</s
    > shipped, although its very ugly and wants some extra investment
  </p>
  <p>
    <b> whitelist / blacklist </b> is something that is <b>farther</b> on the
    horizon! <b>than i thought, it doesn't feel as much a priority to me yet</b>
  </p>
  <p>
    <b>bsky/follow</b> is something i really want to add, i think bsky is
    inherently a very striated space and a pillar of this project is for it to
    be a smoother space that makes it easier to make friends that you can carry
    to other parts of atmosphere
    <b>
      quite low priority now, tbh, especially because i'd like to add OAUTH
      SCOPES, and it's nice to not make bsky records in that case</b
    >
  </p>
  <p>
    <b>building out feed lexicon</b> is farther on the horizon
    <b>(aka feed generators. actually the should come later than)</b>
  </p>
  <p>
    <b>notification lexicon</b> is even further on the horizon
    <b>this is now something i'm gonna prioritize in the short term </b>
  </p>
  <p>
    <b>facets</b> will probably come a lil bit sooner than full notifications, i
    want you to be able to @people. also, replying to messages may be an option,
    this will get added through lrc <b>still i agree with this more or less</b>
  </p>
  <p>
    <b>impl all of lrc functionality</b> will happen, it's kinda funny that i
    don't have this yet, all of the backend is there i think, maybe i'll work on
    this sooner (this is just like <s>mute, unmute,</s> hug, and i think ban unban,
    not sure how those 2 will work they are not impl on backend) I have now implemented
    lrc/mute and lrc/unmute
  </p>
  <p>
    <s
      ><b>images, avis</b> also quite far off, not thinking tooooo hard about these
      yet i don't have a background in web so idrk how any of that works -_-</s
    > shipped! at least images are. do i want to add avatars...... i don't really
    want this to be the same social media site that all the others are, but maybe
    that's desireable...
  </p>
  <p>
    <b>fun homepage system</b> i think this would be outside of lexicon probably,
    but when i imagine this site, i really want to kinda get people interested in
    internet and programming and also i want it to be really participatory and all
    that, so i really want anyone to be able to edit the homepage, and then there's
    like a lil webcomic reader where you can flip through to older homepages. it
    being lexicon removes people's creativity and prevents the manual curation that
    i have in mind...
  </p>
</main>
