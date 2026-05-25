import { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { loginUser } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/store/authStore'
import { Colors } from '@/constants/colors'
import { Spacing } from '@/constants/theme'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError('Email and password are required')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await loginUser({ email, password })
      await setAuth(res.token, res.user)
      router.replace('/')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Sign In" onBack={() => router.replace('/(auth)/welcome')} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>
        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="your@email.com"
            error={error && !password ? error : undefined}
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter your password"
            error={error && password ? error : undefined}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            loadingTitle="Signing in…"
          />
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Text style={styles.footerLink} onPress={() => router.push('/(auth)/welcome')}>
            Sign Up
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  content: { flex: 1, padding: Spacing.lg },
  header: { marginTop: Spacing.lg, marginBottom: Spacing.xl },
  title: { fontSize: 32, fontWeight: '700', color: Colors.text },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginTop: 8 },
  form: { flex: 1, gap: Spacing.sm },
  error: { color: Colors.error, fontSize: 14, marginBottom: 12, textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 32 },
  footerText: { color: Colors.textSecondary, fontSize: 14 },
  footerLink: { color: Colors.primary, fontSize: 14, fontWeight: '600' },
})
