import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { users, studentProfiles, homeownerProfiles } from '$lib/db/schema'
import { hashPassword } from '$lib/auth/password'
import { signToken } from '$lib/auth/jwt'
import { eq } from 'drizzle-orm'
import { randomId } from '$lib/utils/randomId'
import { registerSchema } from '$lib/utils/validators'

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json()
  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    return json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const { email, password, full_name, phone, role, university } = parsed.data

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (existing.length > 0) {
    return json({ error: 'Email already registered' }, { status: 409 })
  }

  const id = randomId()
  const password_hash = hashPassword(password)

  await db.insert(users).values({
    id,
    email,
    password_hash,
    role,
    full_name,
    phone: phone || null,
    is_verified: true,
  })

  if (role === 'student') {
    await db.insert(studentProfiles).values({
      user_id: id,
      university: university || '',
    })
  } else {
    await db.insert(homeownerProfiles).values({
      user_id: id,
    })
  }

  const token = signToken({ userId: id, role })
  const user = {
    id,
    email,
    role,
    full_name,
    phone: phone || null,
    avatar_url: null,
    is_verified: true,
    created_at: new Date().toISOString(),
  }

  return json({ token, user }, { status: 201 })
}
