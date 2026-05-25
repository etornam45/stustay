import crypto from 'node:crypto'
import { env } from '$env/dynamic/private'

function getCloudinaryConfig() {
  const cloudName = env.CLOUDINARY_CLOUD_NAME
  const apiKey = env.CLOUDINARY_API_KEY
  const apiSecret = env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'Cloudinary is not configured on the server. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in apps/web/.env'
    )
  }
  return { cloudName, apiKey, apiSecret }
}

export function getCloudinaryUploadUrl(): string {
  const { cloudName } = getCloudinaryConfig()
  return `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
}

export function getCloudinaryUploadPreset(): string {
  return env.CLOUDINARY_UPLOAD_PRESET || 'stustay_mvp'
}

/** Accept only URLs from our Cloudinary cloud. */
export function isValidCloudinaryUrl(url: string): boolean {
  const cloudName = env.CLOUDINARY_CLOUD_NAME
  if (!cloudName) return url.startsWith('https://res.cloudinary.com/')
  return url.includes(`res.cloudinary.com/${cloudName}/`)
}

/** Server-side signed upload — no unsigned preset required. */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig()

  const timestamp = Math.round(Date.now() / 1000).toString()
  const paramsToSign = `timestamp=${timestamp}`
  const signature = crypto.createHash('sha1').update(paramsToSign + apiSecret).digest('hex')

  const body = new FormData()
  body.append('file', file)
  body.append('api_key', apiKey)
  body.append('timestamp', timestamp)
  body.append('signature', signature)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body,
  })

  const data = (await res.json()) as { secure_url?: string; error?: { message?: string } }
  if (!res.ok) {
    throw new Error(data.error?.message || 'Cloudinary upload failed')
  }
  if (!data.secure_url) {
    throw new Error('Cloudinary upload failed: no URL returned')
  }

  return data.secure_url
}
