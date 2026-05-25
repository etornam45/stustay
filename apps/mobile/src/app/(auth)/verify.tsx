import { useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { verifyEmail } from '@/lib/api/auth'
import { getMe } from '@/lib/api/users'
import { useAuthStore } from '@/lib/store/authStore'
import { Colors } from '@/constants/colors'
import { Spacing } from '@/constants/theme'

export default function VerifyScreen() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)

  async function handleVerify() {
    if (code.length < 6) {
      setError('Enter the 6-digit code from your email')
      return
    }
    setError('')
    setLoading(true)
    try {
      await verifyEmail(code)
      const me = await getMe()
      await setUser({ ...me, is_verified: true })
      if (me.role === 'homeowner') {
        router.replace('/(homeowner)/dashboard')
      } else {
        router.replace('/(student)/home')
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  function handleResend() {
    Alert.alert(
      'Resend code',
      'Check your inbox for the verification email. If you did not receive it, try registering again or contact support.'
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Verify Email" onBack={() => router.back()} />
      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to {user?.email || 'your email'}
        </Text>
        <Input
          label="Verification code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          placeholder="Enter 6-digit code"
          maxLength={6}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          title="Verify"
          onPress={handleVerify}
          loading={loading}
          loadingTitle="Verifying…"
          disabled={code.length < 6}
        />
        <Button title="Resend code" variant="outline" onPress={handleResend} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  content: { padding: Spacing.lg, gap: Spacing.md },
  subtitle: { fontSize: 15, color: Colors.textSecondary },
  error: { color: Colors.error, textAlign: 'center' },
})
