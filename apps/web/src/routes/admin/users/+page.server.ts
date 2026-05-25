import type { PageServerLoad } from './$types'
import { db } from '$lib/db'
import { users } from '$lib/db/schema'
import { sql } from 'drizzle-orm'

export const load: PageServerLoad = async ({ url }) => {
  const roleFilter = url.searchParams.get('role')

  const query = db.select({
    id: users.id,
    email: users.email,
    full_name: users.full_name,
    role: users.role,
    is_verified: users.is_verified,
    is_banned: users.is_banned,
    created_at: users.created_at,
  }).from(users)

  if (roleFilter && (roleFilter === 'student' || roleFilter === 'homeowner' || roleFilter === 'admin')) {
    query.where(sql`${users.role} = ${roleFilter}`)
  }

  const allUsers = await query.orderBy(users.created_at)
  return { users: allUsers }
}
