<script lang="ts">
  let { data, form } = $props()
  let email = $state('')
  let password = $state('')
</script>

<h1>Admin Login</h1>
<form method="POST">
  <label>
    Email
    <input type="email" bind:value={email} name="email" required />
  </label>
  <label>
    Password
    <input type="password" bind:value={password} name="password" required />
  </label>
  {#if form?.error}
    <p style="color: red">{form.error}</p>
  {/if}
  <button type="submit">Sign In</button>
</form>

<style>
  form { display: flex; flex-direction: column; gap: 1rem; max-width: 400px; margin-top: 2rem; }
  label { display: flex; flex-direction: column; gap: 0.25rem; }
  input { padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
  button { padding: 0.75rem; background: #059669; color: white; border: none; border-radius: 4px; cursor: pointer; }
</style>
