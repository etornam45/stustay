import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { conversations, listings } from '$lib/db/schema'
import { randomId } from '$lib/utils/randomId'
import { eq, and } from 'drizzle-orm'
import { conversationCreateSchema } from '$lib/utils/validators'

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'Not authenticated' }, { status: 401 })

  const body = await request.json()
  const parsed = conversationCreateSchema.safeParse(body)
  if (!parsed.success) {
    return json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const listingRows = await db
    .select()
    .from(listings)
    .where(eq(listings.id, parsed.data.listing_id))
    .limit(1)
  const listing = listingRows[0]
  if (!listing) return json({ error: 'Listing not found' }, { status: 404 })

  const homeownerId = parsed.data.homeowner_id || listing.homeowner_id
  let studentId: string
  let homeowner_id: string

  if (locals.user.role === 'student') {
    studentId = locals.user.id
    homeowner_id = homeownerId
  } else if (locals.user.role === 'homeowner') {
    homeowner_id = locals.user.id
    return json({ error: 'Homeowners cannot start chats without a student' }, { status: 400 })
  } else {
    return json({ error: 'Forbidden' }, { status: 403 })
  }

  const existing = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.student_id, studentId),
        eq(conversations.homeowner_id, homeowner_id)
      )
    )
    .limit(1)

  if (existing[0]) {
    if (!existing[0].listing_id) {
      await db
        .update(conversations)
        .set({ listing_id: parsed.data.listing_id })
        .where(eq(conversations.id, existing[0].id))
    }
    return json(existing[0])
  }

  const id = randomId()
  await db.insert(conversations).values({
    id,
    listing_id: parsed.data.listing_id,
    student_id: studentId,
    homeowner_id,
  })

  return json({ id, listing_id: parsed.data.listing_id, student_id: studentId, homeowner_id }, { status: 201 })
}
