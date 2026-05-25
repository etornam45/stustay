import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { listingImages, listings } from '$lib/db/schema'
import { randomId } from '$lib/utils/randomId'
import { eq } from 'drizzle-orm'
import { isValidCloudinaryUrl } from '$lib/storage/cloudinary'
import { listingImagesSchema, replaceListingImagesSchema } from '$lib/utils/validators'

async function assertListingOwner(listingId: string, userId: string, role: string) {
  const [listing] = await db.select().from(listings).where(eq(listings.id, listingId)).limit(1)
  if (!listing) return { error: json({ error: 'Listing not found' }, { status: 404 }) }
  if (listing.homeowner_id !== userId && role !== 'admin') {
    return { error: json({ error: 'Forbidden' }, { status: 403 }) }
  }
  return { listing }
}

export const POST: RequestHandler = async ({ params, request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Not authenticated' }, { status: 401 })
  }

  const auth = await assertListingOwner(params.id, locals.user.id, locals.user.role)
  if (auth.error) return auth.error

  const body = await request.json()
  const parsed = listingImagesSchema.safeParse(body)
  if (!parsed.success) {
    return json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  for (const url of parsed.data.urls) {
    if (!isValidCloudinaryUrl(url)) {
      return json({ error: 'Invalid image URL' }, { status: 400 })
    }
  }

  const existing = await db.select().from(listingImages).where(eq(listingImages.listing_id, params.id))
  const totalImages = existing.length + parsed.data.urls.length
  if (totalImages > 7) {
    return json({ error: 'Maximum 7 images per listing' }, { status: 400 })
  }

  await db.insert(listingImages).values(
    parsed.data.urls.map((url, i) => ({
      id: randomId(),
      listing_id: params.id,
      url,
      is_primary: existing.length === 0 && i === 0,
    }))
  )

  return json({ message: 'Images uploaded' }, { status: 201 })
}

export const PUT: RequestHandler = async ({ params, request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Not authenticated' }, { status: 401 })
  }

  const auth = await assertListingOwner(params.id, locals.user.id, locals.user.role)
  if (auth.error) return auth.error

  const body = await request.json()
  const parsed = replaceListingImagesSchema.safeParse(body)
  if (!parsed.success) {
    return json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  for (const img of parsed.data.images) {
    if (!isValidCloudinaryUrl(img.url)) {
      return json({ error: 'Invalid image URL' }, { status: 400 })
    }
  }

  const primaryCount = parsed.data.images.filter((i) => i.is_primary).length
  if (primaryCount !== 1) {
    return json({ error: 'Exactly one image must be marked as primary' }, { status: 400 })
  }

  await db.delete(listingImages).where(eq(listingImages.listing_id, params.id))
  await db.insert(listingImages).values(
    parsed.data.images.map((img) => ({
      id: randomId(),
      listing_id: params.id,
      url: img.url,
      is_primary: img.is_primary,
    }))
  )

  return json({ message: 'Images updated' })
}
