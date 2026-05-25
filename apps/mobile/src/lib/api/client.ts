import { useAuthStore } from '../store/authStore'
import { signOut } from '../auth/signOut'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5173/api'

interface RequestConfig {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

export async function apiClient<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const token = useAuthStore.getState().token
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...config.headers,
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method: config.method || 'GET',
    headers,
    body: config.body ? JSON.stringify(config.body) : undefined,
  })

  if (!response.ok) {
    if (response.status === 401) {
      await signOut()
    }
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

export function apiGet<T>(path: string) {
  return apiClient<T>(path)
}

export function apiPost<T>(path: string, body?: unknown) {
  return apiClient<T>(path, { method: 'POST', body })
}

export function apiPatch<T>(path: string, body?: unknown) {
  return apiClient<T>(path, { method: 'PATCH', body })
}

export function apiPut<T>(path: string, body?: unknown) {
  return apiClient<T>(path, { method: 'PUT', body })
}

export function apiDelete<T>(path: string) {
  return apiClient<T>(path, { method: 'DELETE' })
}
