<script lang="ts">
  let { children } = $props()
</script>

<div class="flex min-h-screen bg-gray-50">
  <aside class="flex w-60 flex-col border-r border-gray-200 bg-white p-4">
    <div class="mb-8 flex items-center gap-2">
      <h2 class="text-xl font-bold text-emerald-700">StuStay</h2>
      <span class="rounded bg-emerald-600 px-2 py-0.5 text-xs text-white">Admin</span>
    </div>
    <nav class="flex flex-1 flex-col gap-1">
      <a href="/admin" class="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Dashboard</a>
      <a href="/admin/users" class="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Users</a>
      <a href="/admin/listings" class="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Listings</a>
      <a href="/admin/bookings" class="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">Bookings</a>
    </nav>
    <div class="border-t border-gray-200 pt-4">
      <a href="/admin/logout" class="text-sm text-red-500 hover:underline">Sign Out</a>
    </div>
  </aside>
  <main class="flex-1 p-8">
    {@render children()}
  </main>
</div>
