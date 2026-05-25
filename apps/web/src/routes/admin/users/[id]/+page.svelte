<script lang="ts">
  import { enhance } from '$app/forms'
  let { data } = $props()
  let user = $state(data.user)
  let listings = $state(data.listings)
  let studentProfile = $state(data.studentProfile)
  let homeownerProfile = $state(data.homeownerProfile)
</script>

{#if !user}
  <p>User not found</p>
{:else}
  <h1 class="mb-4 text-2xl font-bold">{user.full_name}</h1>
  <dl class="mb-6 grid gap-2 text-sm">
    <div><dt class="font-medium text-gray-500">Email</dt><dd>{user.email}</dd></div>
    <div><dt class="font-medium text-gray-500">Role</dt><dd class="capitalize">{user.role}</dd></div>
    <div><dt class="font-medium text-gray-500">Verified</dt><dd>{user.is_verified ? 'Yes' : 'No'}</dd></div>
    <div><dt class="font-medium text-gray-500">Banned</dt><dd>{user.is_banned ? 'Yes' : 'No'}</dd></div>
    <div><dt class="font-medium text-gray-500">Joined</dt><dd>{new Date(user.created_at).toLocaleDateString()}</dd></div>
  </dl>

  <form method="POST" use:enhance class="mb-8 flex gap-3">
    <button
      type="submit"
      name="action"
      value="verify"
      class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
    >
      {user.is_verified ? 'Unverify' : 'Verify user'}
    </button>
    <button
      type="submit"
      name="action"
      value="ban"
      class="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
    >
      {user.is_banned ? 'Unban' : 'Ban user'}
    </button>
  </form>

  {#if studentProfile}
    <section class="mb-6 rounded-lg border border-gray-200 bg-white p-4">
      <h2 class="mb-3 font-semibold">Student profile</h2>
      <p class="text-sm text-gray-600">University: {studentProfile.university}</p>
      {#if studentProfile.program}<p class="text-sm text-gray-600">Program: {studentProfile.program}</p>{/if}
      {#if studentProfile.student_id_url}
        <p class="mt-3 text-sm font-medium">Student ID</p>
        <a href={studentProfile.student_id_url} target="_blank" rel="noopener noreferrer" class="text-emerald-600 underline">
          View uploaded ID card
        </a>
        <img src={studentProfile.student_id_url} alt="Student ID" class="mt-2 max-h-48 rounded border" />
      {:else}
        <p class="mt-2 text-sm text-amber-600">No student ID uploaded yet</p>
      {/if}
    </section>
  {/if}

  {#if homeownerProfile}
    <section class="mb-6 rounded-lg border border-gray-200 bg-white p-4">
      <h2 class="mb-3 font-semibold">Homeowner profile</h2>
      {#if homeownerProfile.address}<p class="text-sm text-gray-600">Address: {homeownerProfile.address}</p>{/if}
      {#if homeownerProfile.national_id_url}
        <p class="mt-3 text-sm font-medium">National ID</p>
        <a href={homeownerProfile.national_id_url} target="_blank" rel="noopener noreferrer" class="text-emerald-600 underline">
          View uploaded ID
        </a>
        <img src={homeownerProfile.national_id_url} alt="National ID" class="mt-2 max-h-48 rounded border" />
      {:else}
        <p class="mt-2 text-sm text-amber-600">No national ID uploaded yet</p>
      {/if}
    </section>
  {/if}

  {#if listings.length > 0}
    <h2 class="mb-2 font-semibold">Listings ({listings.length})</h2>
    <ul class="space-y-1">
      {#each listings as l}
        <li>
          <a href="/admin/listings/{l.id}" class="text-emerald-600 hover:underline">{l.title}</a>
          <span class="text-gray-500"> ({l.status})</span>
        </li>
      {/each}
    </ul>
  {/if}
{/if}
