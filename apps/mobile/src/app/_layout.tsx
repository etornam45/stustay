import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/store/authStore'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { queryClient } from '@/lib/queryClient'

function RootLayoutInner() {
  const isLoading = useAuthStore((s) => s.isLoading)
  const loadStoredAuth = useAuthStore((s) => s.loadStoredAuth)

  useEffect(() => {
    loadStoredAuth()
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(student)" />
      <Stack.Screen name="(homeowner)" />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <RootLayoutInner />
    </QueryClientProvider>
  )
}
