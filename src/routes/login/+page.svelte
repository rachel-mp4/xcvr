<main>
  <p>
    xcvr uses atproto oauth, so enter your atproto handle below, and then i'll
    look up your personal data server, and direct you to your login page with
    them. i won't even get a sniff of your password, instead they will instead send me a
    temporary key instead which lets me add or subtract stuff from your account
    respository.
  </p>
  <p class="big" style="margin-top:1rem">your handle goes there
     |   |                      |
    V  V                    V    
  </p>
  <form action="{import.meta.env.VITE_API_URL}/oauth/login" method="POST">
    <input
      type="text"
      name="handle"
      id="handle"
      placeholder="@alice.com"
      required
    />
    &lt;—
    <input class="beep" type="submit" value="this is my handle" />
  </form>
  <p class="big">yup...       ^       ^                                  ^
               │     │                                │
               │     └  that's your handle  │
               │            alright...                │
               │                                         │
               │                                     ┌┘
               │                           click that "this is my handle"
               └────when that handle is your handle
  </p>
  <p class="snirp">
    if all this oauth stuff is a bit too intimidating or you don't have an atproto 
    account (currently you can only get one through bluesky) remember that you
    don't need to login to use xcvr!
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
    background: white;
    border-radius: 0;
    border: 0;
    padding: 0;
  }
  .beep {
    background: none;
    color: white;
  }
  .beep:hover {
    font-weight: 700;
    cursor: pointer;
  }
  .snirp {
    margin-top: 1rem;
  }
</style>
