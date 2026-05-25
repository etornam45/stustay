import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { listings, listingImages } from '$lib/db/schema'
import { eq } from 'drizzle-orm'
import { updateListingSchema } from '$lib/utils/validators'

export const GET: RequestHandler = async ({ params, locals }) => {
  const result = await db.select().from(listings).where(eq(listings.id, params.id)).limit(1)
  const listing = result[0]
  if (!listing) {
    return json({ error: 'Listing not found' }, { status: 404 })
  }

  const isOwner = locals.user?.id === listing.homeowner_id
  const isAdmin = locals.user?.role === 'admin'

  if (listing.status !== 'approved' && !isOwner && !isAdmin) {
    return json({ error: 'Listing not available' }, { status: 404 })
  }

  const images = await db.select().from(listingImages).where(eq(listingImages.listing_id, params.id))
  return json({ ...listing, images })
}

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Not authenticated' }, { status: 401 })
  }

  const result = await db.select().from(listings).where(eq(listings.id, params.id)).limit(1)
  const listing = result[0]
  if (!listing) return json({ error: 'Not found' }, { status: 404 })
  if (listing.homeowner_id !== locals.user.id && locals.user.role !== 'admin') {
    return json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const parsed = updateListingSchema.safeParse(body)
  if (!parsed.success) {
    return json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  await db.update(listings).set(parsed.data).where(eq(listings.id, params.id))
  return json({ message: 'Updated' })
}

export const DELETE: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) {
    return json({ error: 'Not authenticated' }, { status: 401 })
  }

  const result = await db.select().from(listings).where(eq(listings.id, params.id)).limit(1)
  const listing = result[0]
  if (!listing) return json({ error: 'Not found' }, { status: 404 })
  if (listing.homeowner_id !== locals.user.id && locals.user.role !== 'admin') {
    return json({ error: 'Forbidden' }, { status: 403 })
  }

  await db.delete(listings).where(eq(listings.id, params.id))
  return json({ message: 'Deleted' })
}
