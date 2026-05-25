import { Redirect } from 'expo-router'
import { useAuthStore } from '@/lib/store/authStore'

export default function Index() {
  const user = useAuthStore((s) => s.user)

  if (!user) {
    return <Redirect href="/(auth)/welcome" />
  }

  if (!user.is_verified) {
    return <Redirect href="/(auth)/verify" />
  }

  if (user.role === 'homeowner') {
    return <Redirect href="/(homeowner)/dashboard" />
  }

  return <Redirect href="/(student)/home" />
}
