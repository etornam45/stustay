import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals, url }) => {
  if (url.pathname !== '/admin/login' && (!locals.user || locals.user.role !== 'admin')) {
    throw redirect(303, '/admin/login')
  }
  return { user: locals.user }
}
