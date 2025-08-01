<main>
  <h2>known bugs</h2>
  <p>
    <b> undo/redo in chat </b> is currently disabled because i believe the events
    which fire on these actions don't provide me with enough information to properly
    broadcast which text was deleted and which text was appended, so i believe i
    need to find a diff library that won't force me to delete the whole message and
    rebroadcast it every history event
  </p>
  <p>
    <b> inability to validate messages </b> occurs at some points in time, possibly
    after the backend restarts, but i'm not totally sure how or why, oauth is a bit
    mysterious to me still and it's likely a silly error somewhere but if you suddenly
    are unable to make any records while logged in, then you should log out and log
    back in
  </p>
  <h2>upcoming features</h2>
  <p>
    <b> whitelist / blacklist </b> is something that i'll probably add soon
  </p>
  <p>
    <b>last confirmed sighting</b> seems like a fun easy lexicon, probably will do
    that p soon
  </p>
  <p>
    <b>bsky/follow</b> is something i really want to add, i think bsky is inherently
    a very striated space and a pillar of this project is for it to be a smoother
    space that makes it easier to make friends that you can carry to other parts
    of atmosphere
  </p>
</main>
