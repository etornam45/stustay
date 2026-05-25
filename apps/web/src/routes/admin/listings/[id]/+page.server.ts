import type { PageServerLoad, Actions } from './$types'
import { db } from '$lib/db'
import { listings, listingImages } from '$lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params }) => {
  const result = await db.select().from(listings).where(eq(listings.id, params.id)).limit(1)
  const listing = result[0]
  if (!listing) return { listing: null, images: [] }

  const images = await db.select().from(listingImages).where(eq(listingImages.listing_id, params.id))
  return { listing, images }
}

export const actions: Actions = {
  default: async ({ request, params }) => {
    const formData = await request.formData()
    const action = formData.get('action') as string

    if (action === 'approve') {
      await db.update(listings).set({ status: 'approved' }).where(eq(listings.id, params.id))
    }

    if (action === 'reject') {
      await db.update(listings).set({ status: 'rejected' }).where(eq(listings.id, params.id))
    }

    throw redirect(303, `/admin/listings/${params.id}`)
  },
}
