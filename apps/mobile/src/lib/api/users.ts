import { apiGet, apiPatch } from './client'
import type { UserPublic, StudentProfile, HomeownerProfile } from '@stustay/shared'

export interface MeResponse extends UserPublic {
  student_profile?: StudentProfile | null
  homeowner_profile?: HomeownerProfile | null
}

export function getMe() {
  return apiGet<MeResponse>('/users/me')
}

export function updateMe(data: Record<string, unknown>) {
  return apiPatch<{ message: string }>('/users/me', data)
}

export function getUserPublic(id: string) {
  return apiGet<UserPublic>(`/users/${id}`)
}
