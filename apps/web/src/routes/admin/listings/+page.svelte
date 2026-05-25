<script lang="ts">
  let { data } = $props()
  let listings = $state(data.listings)
</script>

<h1>Listings</h1>
<div class="filters">
  <a href="/admin/listings">All</a>
  <a href="/admin/listings?status=pending">Pending</a>
  <a href="/admin/listings?status=approved">Approved</a>
  <a href="/admin/listings?status=rejected">Rejected</a>
  <a href="/admin/listings?status=taken">Taken</a>
</div>
<table>
  <thead>
    <tr><th>Title</th><th>Price</th><th>Bedrooms</th><th>Status</th><th>Created</th></tr>
  </thead>
  <tbody>
    {#each listings as listing}
      <tr>
        <td><a href="/admin/listings/{listing.id}">{listing.title}</a></td>
        <td>Ghc {listing.price_per_semester.toLocaleString()}</td>
        <td>{listing.bedrooms}</td>
        <td>{listing.status}</td>
        <td>{new Date(listing.created_at).toLocaleDateString()}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .filters { display: flex; gap: 0.5rem; margin: 1rem 0; flex-wrap: wrap; }
  .filters a { padding: 0.25rem 0.75rem; border: 1px solid #e5e7eb; border-radius: 4px; text-decoration: none; color: #374151; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #e5e7eb; }
  th { font-weight: 600; color: #6b7280; font-size: 0.875rem; }
</style>
