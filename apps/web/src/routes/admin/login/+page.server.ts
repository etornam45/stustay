import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import { db } from '$lib/db'
import { users } from '$lib/db/schema'
import { verifyPassword } from '$lib/auth/password'
import { signToken } from '$lib/auth/jwt'
import { eq } from 'drizzle-orm'

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData()
    const email = data.get('email') as string
    const password = data.get('password') as string

    if (!email || !password) {
      return fail(400, { error: 'Email and password required' })
    }

    let result
    try {
      result = await db.select().from(users).where(eq(users.email, email)).limit(1)
    } catch (err) {
      console.error('[admin/login] database error:', err)
      return fail(503, {
        error:
          'Database unavailable. Run: cd apps/web && bun run db:setup — then restart the dev server.',
      })
    }
    const user = result[0]

    if (!user || user.role !== 'admin' || !verifyPassword(password, user.password_hash)) {
      return fail(401, { error: 'Invalid credentials' })
    }

    const token = signToken({ userId: user.id, role: 'admin' })
    cookies.set('admin_session', token, {
      path: '/admin',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
    })

    throw redirect(303, '/admin')
  },
}
