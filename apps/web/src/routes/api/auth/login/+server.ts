import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { users } from '$lib/db/schema'
import { verifyPassword } from '$lib/auth/password'
import { signToken } from '$lib/auth/jwt'
import { eq } from 'drizzle-orm'
import { loginSchema } from '$lib/utils/validators'

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json()
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const { email, password } = parsed.data

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1)
  const user = result[0]
  if (!user || user.is_banned) {
    return json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const valid = verifyPassword(password, user.password_hash)
  if (!valid) {
    return json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const token = signToken({ userId: user.id, role: user.role })

  return json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      phone: user.phone,
      avatar_url: user.avatar_url,
      is_verified: user.is_verified,
      created_at: user.created_at.toISOString(),
    },
  })
}
