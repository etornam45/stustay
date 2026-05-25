import type { PageServerLoad } from './$types'
import { db } from '$lib/db'
import { users, listings, bookings } from '$lib/db/schema'
import { eq, sql } from 'drizzle-orm'

export const load: PageServerLoad = async () => {
  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users)
  const [listingCount] = await db.select({ count: sql<number>`count(*)` }).from(listings)
  const [pendingCount] = await db.select({ count: sql<number>`count(*)` }).from(listings).where(eq(listings.status, 'pending'))
  const [bookingCount] = await db.select({ count: sql<number>`count(*)` }).from(bookings)

  return {
    stats: {
      users: Number(userCount.count),
      listings: Number(listingCount.count),
      pending: Number(pendingCount.count),
      bookings: Number(bookingCount.count),
    },
  }
}
