import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { verifyToken, signToken } from '$lib/auth/jwt'

export const POST: RequestHandler = async ({ request }) => {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return json({ error: 'No token provided' }, { status: 401 })
  }

  const token = authHeader.slice(7)
  const payload = verifyToken(token)
  if (!payload) {
    return json({ error: 'Invalid token' }, { status: 401 })
  }

  const newToken = signToken({ userId: payload.userId, role: payload.role })
  return json({ token: newToken })
}
