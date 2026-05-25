<script lang="ts">
  let { data } = $props()
  let stats = $state(data.stats)
</script>

<h1 class="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>
{#if stats.pending > 0}
  <div class="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
    {stats.pending} listing(s) awaiting approval — <a href="/admin/listings" class="font-semibold underline">Review now</a>
  </div>
{/if}
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <h3 class="text-sm font-medium uppercase tracking-wide text-gray-500">Total Users</h3>
    <p class="mt-2 text-3xl font-bold text-emerald-600">{stats.users}</p>
  </div>
  <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <h3 class="text-sm font-medium uppercase tracking-wide text-gray-500">Total Listings</h3>
    <p class="mt-2 text-3xl font-bold text-emerald-600">{stats.listings}</p>
  </div>
  <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <h3 class="text-sm font-medium uppercase tracking-wide text-gray-500">Pending Approvals</h3>
    <p class="mt-2 text-3xl font-bold text-amber-600">{stats.pending}</p>
  </div>
  <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    <h3 class="text-sm font-medium uppercase tracking-wide text-gray-500">Bookings</h3>
    <p class="mt-2 text-3xl font-bold text-emerald-600">{stats.bookings}</p>
  </div>
</div>
