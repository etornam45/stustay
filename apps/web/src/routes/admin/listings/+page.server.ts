import type { PageServerLoad } from './$types'
import { db } from '$lib/db'
import { listings } from '$lib/db/schema'
import { sql } from 'drizzle-orm'

export const load: PageServerLoad = async ({ url }) => {
  const statusFilter = url.searchParams.get('status')

  const query = db.select().from(listings)
  if (statusFilter) {
    query.where(sql`${listings.status} = ${statusFilter}`)
  }

  const allListings = await query.orderBy(listings.created_at)
  return { listings: allListings }
}
