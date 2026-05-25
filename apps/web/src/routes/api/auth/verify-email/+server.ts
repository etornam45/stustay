import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { users } from '$lib/db/schema'
import { eq, and, gt } from 'drizzle-orm'
import { verifyEmailSchema as verifySchema } from '$lib/utils/validators'

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = verifySchema.safeParse(body)
  if (!parsed.success) {
    return json({ error: 'Invalid verification code' }, { status: 400 })
  }

  const result = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.id, locals.user.id),
        eq(users.verification_code, parsed.data.code),
        gt(users.verification_expires, new Date())
      )
    )
    .limit(1)

  if (!result[0]) {
    return json({ error: 'Invalid or expired code' }, { status: 400 })
  }

  await db
    .update(users)
    .set({
      is_verified: true,
      verification_code: null,
      verification_expires: null,
    })
    .where(eq(users.id, locals.user.id))

  return json({ message: 'Email verified' })
}
