import type { PageServerLoad, Actions } from './$types'
import { db } from '$lib/db'
import { users, listings, studentProfiles, homeownerProfiles } from '$lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params }) => {
  const result = await db.select().from(users).where(eq(users.id, params.id)).limit(1)
  const user = result[0]
  if (!user) return { user: null, listings: [], studentProfile: null, homeownerProfile: null }

  const userListings = await db.select().from(listings).where(eq(listings.homeowner_id, params.id))
  const studentProfile = await db.select().from(studentProfiles).where(eq(studentProfiles.user_id, params.id)).limit(1)
  const homeownerProfile = await db.select().from(homeownerProfiles).where(eq(homeownerProfiles.user_id, params.id)).limit(1)

  return { user, listings: userListings, studentProfile: studentProfile[0] || null, homeownerProfile: homeownerProfile[0] || null }
}

export const actions: Actions = {
  default: async ({ request, params }) => {
    const formData = await request.formData()
    const action = formData.get('action') as string

    if (action === 'verify') {
      const result = await db.select({ is_verified: users.is_verified }).from(users).where(eq(users.id, params.id)).limit(1)
      if (result[0]) {
        await db.update(users).set({ is_verified: !result[0].is_verified }).where(eq(users.id, params.id))
      }
    }

    if (action === 'ban') {
      const result = await db.select({ is_banned: users.is_banned }).from(users).where(eq(users.id, params.id)).limit(1)
      if (result[0]) {
        await db.update(users).set({ is_banned: !result[0].is_banned }).where(eq(users.id, params.id))
      }
    }

    throw redirect(303, `/admin/users/${params.id}`)
  },
}
