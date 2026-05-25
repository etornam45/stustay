import type { PageServerLoad } from './$types'
import { db } from '$lib/db'
import { bookings } from '$lib/db/schema'

export const load: PageServerLoad = async () => {
  const allBookings = await db.select().from(bookings).orderBy(bookings.created_at)
  return { bookings: allBookings }
}
