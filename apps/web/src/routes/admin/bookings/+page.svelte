<script lang="ts">
  let { data } = $props()
  let bookings = $state(data.bookings)
</script>

<h1>Bookings</h1>
<table>
  <thead>
    <tr><th>ID</th><th>Listing</th><th>Student</th><th>Status</th><th>Semester</th><th>Date</th></tr>
  </thead>
  <tbody>
    {#each bookings as booking}
      <tr>
        <td style="font-family: monospace; font-size: 0.8rem;">{booking.id.slice(0, 8)}...</td>
        <td>{booking.listing_id.slice(0, 8)}...</td>
        <td>{booking.student_id.slice(0, 8)}...</td>
        <td>{booking.status}</td>
        <td>{booking.semester} {booking.academic_year}</td>
        <td>{new Date(booking.created_at).toLocaleDateString()}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
  th, td { text-align: left; padding: 0.75rem; border-bottom: 1px solid #e5e7eb; }
  th { font-weight: 600; color: #6b7280; font-size: 0.875rem; }
</style>
