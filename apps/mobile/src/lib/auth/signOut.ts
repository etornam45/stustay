import { router } from 'expo-router'
import { useAuthStore } from '@/lib/store/authStore'
import { queryClient } from '@/lib/queryClient'

export function navigateForUser() {
  const user = useAuthStore.getState().user
  if (!user) {
    router.replace('/(auth)/welcome')
    return
  }
  if (user.role === 'homeowner') {
    router.replace('/(homeowner)/dashboard')
    return
  }
  router.replace('/(student)/home')
}

export async function signOut() {
  await useAuthStore.getState().logout()
  queryClient.clear()
  navigateForUser()
}

export async function switchAccount(userId: string) {
  const ok = await useAuthStore.getState().switchAccount(userId)
  if (!ok) return
  queryClient.clear()
  navigateForUser()
}

export async function removeAccount(userId: string) {
  await useAuthStore.getState().removeAccount(userId)
  queryClient.clear()
  navigateForUser()
}
