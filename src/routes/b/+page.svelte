<script lang="ts">
  const base = import.meta.env.VITE_API_URL;
</script>

<main>
  <h1>try to ban someone</h1>
  <p>this probably shouldn't do anything unless you're me</p>
  <form action={`${base}/oauth/ban`} method="POST">
    <div>
      <label for="user">user to ban: </label>
      <input type="text" name="user" id="user" required />
    </div>
    <div>
      <label for="days">number of days to ban for: </label>
      <input type="text" name="days" id="days" />
    </div>
    <div>
      <label for="reason">reason: </label>
      <input type="text" name="reason" id="reason" />
    </div>
    <div>
      <input type="submit" value="ban" />
    </div>
  </form>
</main>
