import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { bookings, listings, users } from '$lib/db/schema'
import { randomId } from '$lib/utils/randomId'
import { eq, and, desc } from 'drizzle-orm'
import { bookingCreateSchema } from '$lib/utils/validators'
import { sendNewBookingEmail } from '$lib/email/sender'

export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) return json({ error: 'Not authenticated' }, { status: 401 })

  const status = url.searchParams.get('status')

  let condition
  if (locals.user.role === 'student') {
    condition = eq(bookings.student_id, locals.user.id)
  } else if (locals.user.role === 'homeowner') {
    condition = eq(bookings.homeowner_id, locals.user.id)
  } else {
    condition = undefined
  }

  const filters = condition ? [condition] : []
  if (status) {
    filters.push(
      eq(bookings.status, status as 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed')
    )
  }

  const results = await db
    .select({
      booking: bookings,
      listing_title: listings.title,
    })
    .from(bookings)
    .innerJoin(listings, eq(bookings.listing_id, listings.id))
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(bookings.created_at))

  return json(
    results.map((r) => ({
      ...r.booking,
      listing_title: r.listing_title,
    }))
  )
}

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user || locals.user.role !== 'student') {
    return json({ error: 'Only students can create bookings' }, { status: 403 })
  }

  const body = await request.json()
  const parsed = bookingCreateSchema.safeParse(body)
  if (!parsed.success) {
    return json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const listing = await db
    .select()
    .from(listings)
    .where(eq(listings.id, parsed.data.listing_id))
    .limit(1)
  if (!listing[0]) {
    return json({ error: 'Listing not found' }, { status: 404 })
  }
  if (listing[0].status !== 'approved') {
    return json({ error: 'Listing is not available' }, { status: 400 })
  }

  const id = randomId()
  await db.insert(bookings).values({
    id,
    listing_id: parsed.data.listing_id,
    student_id: locals.user.id,
    homeowner_id: listing[0].homeowner_id,
    semester: parsed.data.semester,
    academic_year: parsed.data.academic_year,
    message: parsed.data.message || null,
  })

  const [student] = await db
    .select({ full_name: users.full_name })
    .from(users)
    .where(eq(users.id, locals.user.id))
    .limit(1)

  const [homeowner] = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, listing[0].homeowner_id))
    .limit(1)

  if (homeowner?.email) {
    await sendNewBookingEmail(
      homeowner.email,
      listing[0].title,
      student?.full_name || 'A student',
      parsed.data.semester,
      parsed.data.academic_year
    )
  }

  return json({ id }, { status: 201 })
}
