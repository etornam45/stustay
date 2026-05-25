import { File, UploadType } from 'expo-file-system'
import { useAuthStore } from '@/lib/store/authStore'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5173/api'

function mimeFromUri(uri: string): string {
  const lower = uri.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.heic')) return 'image/heic'
  return 'image/jpeg'
}

export async function uploadImageToCloudinary(uri: string): Promise<string> {
  const token = useAuthStore.getState().token
  if (!token) {
    throw new Error('You must be signed in to upload images')
  }

  const file = new File(uri)
  const result = await file.upload(`${API_URL}/uploads/image`, {
    uploadType: UploadType.MULTIPART,
    fieldName: 'file',
    mimeType: mimeFromUri(uri),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (result.status < 200 || result.status >= 300) {
    let message = `Upload failed (${result.status})`
    try {
      const err = JSON.parse(result.body || '{}') as { error?: string }
      if (err.error) message = err.error
    } catch {
      // keep default message
    }
    throw new Error(message)
  }

  const data = JSON.parse(result.body) as { url?: string }
  if (!data.url) {
    throw new Error('Upload failed: no URL returned')
  }

  return data.url
}
