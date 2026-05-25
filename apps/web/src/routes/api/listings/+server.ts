import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { listings, listingImages } from '$lib/db/schema'
import { randomId } from '$lib/utils/randomId'
import { eq, and, gte, lte, sql } from 'drizzle-orm'
import { createListingSchema } from '$lib/utils/validators'

export const GET: RequestHandler = async ({ url, locals }) => {
  const query = url.searchParams.get('query') || ''
  const minPrice = url.searchParams.get('min_price')
  const maxPrice = url.searchParams.get('max_price')
  const bedrooms = url.searchParams.get('bedrooms')
  const furnished = url.searchParams.get('is_furnished')
  const hasWifi = url.searchParams.get('has_wifi')
  const hasSecurity = url.searchParams.get('has_security')
  const hasBackup = url.searchParams.get('has_backup_power')
  const hasWater = url.searchParams.get('has_water')
  const mine = url.searchParams.get('mine') === 'true'
  const lat = url.searchParams.get('latitude')
  const lng = url.searchParams.get('longitude')
  const radiusKm = url.searchParams.get('radius_km')

  const conditions: ReturnType<typeof eq>[] = []

  if (mine) {
    if (!locals.user || locals.user.role !== 'homeowner') {
      return json({ error: 'Forbidden' }, { status: 403 })
    }
    conditions.push(eq(listings.homeowner_id, locals.user.id))
  } else {
    conditions.push(eq(listings.status, 'approved'))
  }

  if (minPrice) conditions.push(gte(listings.price_per_semester, parseInt(minPrice)))
  if (maxPrice) conditions.push(lte(listings.price_per_semester, parseInt(maxPrice)))
  if (bedrooms) conditions.push(eq(listings.bedrooms, parseInt(bedrooms)))
  if (furnished === 'true') conditions.push(eq(listings.is_furnished, true))
  if (hasWifi === 'true') conditions.push(eq(listings.has_wifi, true))
  if (hasSecurity === 'true') conditions.push(eq(listings.has_security, true))
  if (hasBackup === 'true') conditions.push(eq(listings.has_backup_power, true))
  if (hasWater === 'true') conditions.push(eq(listings.has_water, true))
  if (query) {
    conditions.push(
      sql`(${listings.title} ILIKE ${'%' + query + '%'} OR ${listings.description} ILIKE ${'%' + query + '%'} OR ${listings.address} ILIKE ${'%' + query + '%'})`
    )
  }

  if (lat && lng && radiusKm) {
    const radius = parseFloat(radiusKm)
    conditions.push(
      sql`(
        6371 * acos(
          cos(radians(${parseFloat(lat)})) * cos(radians(${listings.latitude}))
          * cos(radians(${listings.longitude}) - radians(${parseFloat(lng)}))
          + sin(radians(${parseFloat(lat)})) * sin(radians(${listings.latitude}))
        )
      ) <= ${radius}`
    )
  }

  const results = await db
    .select()
    .from(listings)
    .where(and(...conditions))
    .orderBy(listings.created_at)

  const withImages = await Promise.all(
    results.map(async (listing) => {
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
  if (!locals.user || locals.user.role !== 'homeowner') {
    return json({ error: 'Only homeowners can create listings' }, { status: 403 })
  }

  const body = await request.json()
  const parsed = createListingSchema.safeParse(body)
  if (!parsed.success) {
    return json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const { images, ...data } = parsed.data
  const id = randomId()

  await db.insert(listings).values({
    id,
    homeowner_id: locals.user.id,
    ...data,
    status: 'approved',
  })

  if (images?.length) {
    await db.insert(listingImages).values(
      images.map((url, i) => ({
        id: randomId(),
        listing_id: id,
        url,
        is_primary: i === 0,
      }))
    )
  }

  return json({ id, message: 'Listing published' }, { status: 201 })
}
