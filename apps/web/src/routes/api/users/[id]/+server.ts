import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { users } from '$lib/db/schema'
import { eq } from 'drizzle-orm'

export const GET: RequestHandler = async ({ params }) => {
  const result = await db.select({
    id: users.id,
    full_name: users.full_name,
    avatar_url: users.avatar_url,
    role: users.role,
    created_at: users.created_at,
  }).from(users).where(eq(users.id, params.id)).limit(1)

  const user = result[0]
  if (!user) return json({ error: 'User not found' }, { status: 404 })

  return json(user)
}
