<script lang="ts">
  let { data } = $props()
  let users = $state(data.users)
</script>

<h1>Users</h1>
<div class="filters">
  <a href="/admin/users">All</a>
  <a href="/admin/users?role=student">Students</a>
  <a href="/admin/users?role=homeowner">Homeowners</a>
  <a href="/admin/users?role=admin">Admins</a>
</div>
<table>
  <thead>
    <tr><th>Name</th><th>Email</th><th>Role</th><th>Verified</th><th>Banned</th><th>Joined</th></tr>
  </thead>
  <tbody>
    {#each users as user}
      <tr>
        <td><a href="/admin/users/{user.id}">{user.full_name}</a></td>
        <td>{user.email}</td>
        <td>{user.role}</td>
        <td>{user.is_verified ? 'Yes' : 'No'}</td>
        <td>{user.is_banned ? 'Banned' : '-'}</td>
        <td>{new Date(user.created_at).toLocaleDateString()}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .filters { display: flex; gap: 0.5rem; margin: 1rem 0; }
  .filters a { padding: 0.25rem 0.75rem; border: 1px solid #e5e7eb; border-radius: 4px; text-decoration: none; color: #374151; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #e5e7eb; }
  th { font-weight: 600; color: #6b7280; font-size: 0.875rem; }
</style>
