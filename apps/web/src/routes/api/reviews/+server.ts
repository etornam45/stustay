import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { reviews, bookings } from '$lib/db/schema'
import { randomId } from '$lib/utils/randomId'
import { eq } from 'drizzle-orm'
import { reviewSchema } from '$lib/utils/validators'

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'Not authenticated' }, { status: 401 })

  const body = await request.json()
  const parsed = reviewSchema.safeParse(body)
  if (!parsed.success) {
    return json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const booking = await db.select().from(bookings).where(eq(bookings.id, parsed.data.booking_id)).limit(1)
  if (!booking[0]) return json({ error: 'Booking not found' }, { status: 404 })
  if (booking[0].status !== 'completed') {
    return json({ error: 'Can only review completed bookings' }, { status: 400 })
  }
  if (booking[0].student_id !== locals.user.id && booking[0].homeowner_id !== locals.user.id) {
    return json({ error: 'Forbidden' }, { status: 403 })
  }

  const id = randomId()
  await db.insert(reviews).values({
    id,
    booking_id: parsed.data.booking_id,
    reviewer_id: locals.user.id,
    reviewee_id: parsed.data.reviewee_id,
    listing_id: parsed.data.listing_id,
    rating: parsed.data.rating,
    comment: parsed.data.comment || null,
  })

  return json({ id }, { status: 201 })
}
