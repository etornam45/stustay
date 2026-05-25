import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  const authHeader = event.request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const { verifyToken } = await import('$lib/auth/jwt')
    const payload = verifyToken(token)
    if (payload) {
      event.locals.user = { id: payload.userId, role: payload.role } as any
    }
  }

  const adminCookie = event.cookies.get('admin_session')
  if (adminCookie) {
    const { verifyToken } = await import('$lib/auth/jwt')
    const payload = verifyToken(adminCookie)
    if (payload) {
      event.locals.user = { id: payload.userId, role: 'admin' } as any
    }
  }

  const response = await resolve(event)
  return response
}
