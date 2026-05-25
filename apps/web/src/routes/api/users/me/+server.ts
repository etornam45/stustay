import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { users, studentProfiles, homeownerProfiles } from '$lib/db/schema'
import { eq } from 'drizzle-orm'
import { profilePatchSchema } from '$lib/utils/validators'

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) {
    return json({ error: 'Not authenticated' }, { status: 401 })
  }

  const result = await db.select().from(users).where(eq(users.id, locals.user.id)).limit(1)
  const user = result[0]
  if (!user) {
    return json({ error: 'User not found' }, { status: 404 })
  }

  let student_profile = null
  let homeowner_profile = null

  if (user.role === 'student') {
    const sp = await db
      .select()
      .from(studentProfiles)
      .where(eq(studentProfiles.user_id, user.id))
      .limit(1)
    student_profile = sp[0] || null
  }
  if (user.role === 'homeowner') {
    const hp = await db
      .select()
      .from(homeownerProfiles)
      .where(eq(homeownerProfiles.user_id, user.id))
      .limit(1)
    homeowner_profile = hp[0] || null
  }

  return json({
    id: user.id,
    email: user.email,
    role: user.role,
    full_name: user.full_name,
    phone: user.phone,
    avatar_url: user.avatar_url,
    is_verified: user.is_verified,
    created_at: user.created_at.toISOString(),
    student_profile,
    homeowner_profile,
  })
}

export const PATCH: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = profilePatchSchema.safeParse(body)
  if (!parsed.success) {
    return json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const { full_name, phone, avatar_url, student_id_url, national_id_url, program, year_of_study, address, bio } =
    parsed.data

  if (full_name !== undefined || phone !== undefined || avatar_url !== undefined) {
    await db
      .update(users)
      .set({
        ...(full_name !== undefined && { full_name }),
        ...(phone !== undefined && { phone }),
        ...(avatar_url !== undefined && { avatar_url }),
      })
      .where(eq(users.id, locals.user.id))
  }

  if (locals.user.role === 'student' && (student_id_url !== undefined || program !== undefined || year_of_study !== undefined)) {
    await db
      .update(studentProfiles)
      .set({
        ...(student_id_url !== undefined && { student_id_url }),
        ...(program !== undefined && { program }),
        ...(year_of_study !== undefined && { year_of_study }),
      })
      .where(eq(studentProfiles.user_id, locals.user.id))
  }

  if (locals.user.role === 'homeowner' && (national_id_url !== undefined || address !== undefined || bio !== undefined)) {
    await db
      .update(homeownerProfiles)
      .set({
        ...(national_id_url !== undefined && { national_id_url }),
        ...(address !== undefined && { address }),
        ...(bio !== undefined && { bio }),
      })
      .where(eq(homeownerProfiles.user_id, locals.user.id))
  }

  return json({ message: 'Profile updated' })
}
