import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { savedListings, listings, listingImages } from '$lib/db/schema'
import { eq, and, inArray } from 'drizzle-orm'

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) return json({ error: 'Not authenticated' }, { status: 401 })

  const saved = await db
    .select()
    .from(savedListings)
    .where(eq(savedListings.user_id, locals.user.id))

  if (!saved.length) return json([])

  const ids = saved.map((s) => s.listing_id)
  const listingRows = await db.select().from(listings).where(inArray(listings.id, ids))

  const withImages = await Promise.all(
    listingRows.map(async (listing) => {
      const images = await db
        .select()
        .from(listingImages)
        .where(eq(listingImages.listing_id, listing.id))
      return { ...listing, images }
    })
  )

  return json(withImages)
}

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'Not authenticated' }, { status: 401 })

  const { listing_id } = await request.json()
  if (!listing_id) return json({ error: 'listing_id required' }, { status: 400 })

  const existing = await db
    .select()
    .from(savedListings)
    .where(and(eq(savedListings.user_id, locals.user.id), eq(savedListings.listing_id, listing_id)))
    .limit(1)

  if (existing.length > 0) {
    await db
      .delete(savedListings)
      .where(and(eq(savedListings.user_id, locals.user.id), eq(savedListings.listing_id, listing_id)))
    return json({ saved: false })
  }

  await db.insert(savedListings).values({ user_id: locals.user.id, listing_id })
  return json({ saved: true }, { status: 201 })
}

export const DELETE: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) return json({ error: 'Not authenticated' }, { status: 401 })

  const listing_id = url.searchParams.get('listing_id')
  if (!listing_id) return json({ error: 'listing_id required' }, { status: 400 })

  await db
    .delete(savedListings)
    .where(and(eq(savedListings.user_id, locals.user.id), eq(savedListings.listing_id, listing_id)))

  return json({ saved: false })
}
