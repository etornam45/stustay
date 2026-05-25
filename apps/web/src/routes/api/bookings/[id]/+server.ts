import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { bookings, listings, users, conversations } from '$lib/db/schema'
import { randomId } from '$lib/utils/randomId'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { sendBookingStatusEmail } from '$lib/email/sender'

const statusSchema = z.object({
  status: z.enum(['accepted', 'rejected', 'cancelled', 'completed']),
})

export const GET: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) return json({ error: 'Not authenticated' }, { status: 401 })

  const result = await db.select().from(bookings).where(eq(bookings.id, params.id)).limit(1)
  const booking = result[0]
  if (!booking) return json({ error: 'Not found' }, { status: 404 })
  if (
    booking.student_id !== locals.user.id &&
    booking.homeowner_id !== locals.user.id &&
    locals.user.role !== 'admin'
  ) {
    return json({ error: 'Forbidden' }, { status: 403 })
  }

  return json(booking)
}

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
  if (!locals.user) return json({ error: 'Not authenticated' }, { status: 401 })

  const body = await request.json()
  const parsed = statusSchema.safeParse(body)
  if (!parsed.success) {
    return json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const result = await db.select().from(bookings).where(eq(bookings.id, params.id)).limit(1)
  const booking = result[0]
  if (!booking) return json({ error: 'Not found' }, { status: 404 })

  if (locals.user.role === 'homeowner' && booking.homeowner_id !== locals.user.id) {
    return json({ error: 'Forbidden' }, { status: 403 })
  }
  if (locals.user.role === 'student' && booking.student_id !== locals.user.id) {
    return json({ error: 'Forbidden' }, { status: 403 })
  }

  await db
    .update(bookings)
    .set({
      status: parsed.data.status,
      ...(parsed.data.status === 'completed' ? { completed_at: new Date() } : {}),
    })
    .where(eq(bookings.id, params.id))

  if (parsed.data.status === 'accepted' || parsed.data.status === 'rejected') {
    const listingRows = await db
      .select()
      .from(listings)
      .where(eq(listings.id, booking.listing_id))
      .limit(1)
    const studentRows = await db
      .select()
      .from(users)
      .where(eq(users.id, booking.student_id))
      .limit(1)
    const title = listingRows[0]?.title || 'your listing'
    if (studentRows[0]?.email) {
      await sendBookingStatusEmail(
        studentRows[0].email,
        parsed.data.status,
        title
      )
    }

    if (parsed.data.status === 'accepted') {
      const existingConv = await db
        .select()
        .from(conversations)
        .where(eq(conversations.student_id, booking.student_id))
        .limit(1)
      if (!existingConv.some((c) => c.homeowner_id === booking.homeowner_id)) {
        await db.insert(conversations).values({
          id: randomId(),
          booking_id: params.id,
          student_id: booking.student_id,
          homeowner_id: booking.homeowner_id,
        })
      }
    }
  }

  return json({ message: `Booking ${parsed.data.status}` })
}
