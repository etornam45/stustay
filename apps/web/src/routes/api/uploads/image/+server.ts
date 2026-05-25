import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { uploadImageToCloudinary } from '$lib/storage/cloudinary'

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: 'Not authenticated' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!file || !(file instanceof File)) {
    return json({ error: 'No image file provided' }, { status: 400 })
  }

  if (!file.type.startsWith('image/')) {
    return json({ error: 'File must be an image' }, { status: 400 })
  }

  if (file.size > 10 * 1024 * 1024) {
    return json({ error: 'Image must be under 10MB' }, { status: 400 })
  }

  try {
    const url = await uploadImageToCloudinary(file)
    return json({ url })
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Upload failed' }, { status: 500 })
  }
}
