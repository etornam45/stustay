import { apiClient, apiPost } from './client'
import type { UserPublic } from '@stustay/shared'

interface RegisterInput {
  email: string
  password: string
  full_name: string
  phone: string
  role: 'student' | 'homeowner'
  university?: string
}

interface LoginInput {
  email: string
  password: string
}

interface AuthResponse {
  token: string
  user: UserPublic
}

export function registerUser(data: RegisterInput) {
  return apiClient<AuthResponse>('/auth/register', {
    method: 'POST',
    body: data,
  })
}

export function loginUser(data: LoginInput) {
  return apiClient<AuthResponse>('/auth/login', {
    method: 'POST',
    body: data,
  })
}

export function verifyEmail(code: string) {
  return apiPost<{ message: string }>('/auth/verify-email', { code })
}

export function refreshToken() {
  return apiPost<{ token: string }>('/auth/refresh')
}
