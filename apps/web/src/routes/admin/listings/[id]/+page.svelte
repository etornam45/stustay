<script lang="ts">
  import { enhance } from '$app/forms'
  let { data } = $props()
  let listing = $state(data.listing)
  let images = $state(data.images)
</script>

{#if !listing}
  <p>Listing not found</p>
{:else}
  <h1>{listing.title}</h1>
  <dl>
    <dt>Price</dt><dd>Ghc {listing.price_per_semester.toLocaleString()}/sem</dd>
    <dt>Bedrooms</dt><dd>{listing.bedrooms}</dd>
    <dt>Bathrooms</dt><dd>{listing.bathrooms}</dd>
    <dt>Status</dt><dd>{listing.status}</dd>
    <dt>Address</dt><dd>{listing.address}</dd>
  </dl>

  {#if listing.status === 'pending'}
    <form method="POST" use:enhance>
      <button name="action" value="approve">Approve</button>
      <button name="action" value="reject">Reject</button>
    </form>
  {/if}

  {#if images.length > 0}
    <h2>Images ({images.length})</h2>
    <div class="images">
      {#each images as img}
        <img src={img.url} alt="listing" style="max-width: 200px; border-radius: 4px;" />
      {/each}
    </div>
  {/if}
{/if}
