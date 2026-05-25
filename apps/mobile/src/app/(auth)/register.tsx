import { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { registerUser } from '@/lib/api/auth'
import { useAuthStore } from '@/lib/store/authStore'
import { Colors } from '@/constants/colors'
import { Spacing } from '@/constants/theme'
import { SelectField } from '@/components/ui/SelectField'
import { UNIVERSITIES } from '@stustay/shared'

const UNIVERSITY_OPTIONS = UNIVERSITIES.map((u) => ({ label: u.name, value: u.name }))

export default function RegisterScreen() {
  const { role: initialRole } = useLocalSearchParams<{ role: string }>()
  const [role, setRole] = useState<'student' | 'homeowner'>(
    (initialRole as 'student' | 'homeowner') || 'student'
  )
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [university, setUniversity] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)

  function validate(): string | null {
    if (!fullName.trim()) return 'Full name is required'
    if (!email.trim()) return 'Email is required'
    if (!password || password.length < 6) return 'Password must be at least 6 characters'
    if (role === 'student' && !university) return 'Please select your university'
    return null
  }

  async function handleRegister() {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await registerUser({
        email,
        password,
        full_name: fullName,
        phone,
        role,
        university: role === 'student' ? university : undefined,
      })
      await setAuth(res.token, res.user)
      router.replace('/(auth)/verify')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Create Account" onBack={() => router.replace('/(auth)/welcome')} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.roleRow}>
          <Text
            style={[styles.roleOption, role === 'student' && styles.roleActive]}
            onPress={() => setRole('student')}
          >
            Student
          </Text>
          <Text
            style={[styles.roleOption, role === 'homeowner' && styles.roleActive]}
            onPress={() => setRole('homeowner')}
          >
            Homeowner
          </Text>
        </View>

        <Input label="Full Name" value={fullName} onChangeText={setFullName} placeholder="John Doe" />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="your@email.com"
        />
        <Input
          label="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="+233 XX XXX XXXX"
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Create a password (min 6 chars)"
        />
        {role === 'student' && (
          <SelectField
            label="University"
            value={university}
            options={UNIVERSITY_OPTIONS}
            onChange={setUniversity}
            placeholder="Select your university"
          />
        )}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          title="Create Account"
          onPress={handleRegister}
          loading={loading}
          loadingTitle="Creating account…"
        />
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Text style={styles.footerLink} onPress={() => router.push('/(auth)/login')}>
            Sign In
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  scroll: { padding: Spacing.lg, paddingBottom: 32 },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: Spacing.lg },
  roleOption: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textSecondary,
    overflow: 'hidden',
  },
  roleActive: { backgroundColor: Colors.primary, borderColor: Colors.primary, color: '#fff' },
  error: { color: Colors.error, fontSize: 14, marginBottom: 12, textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 24 },
  footerText: { color: Colors.textSecondary, fontSize: 14 },
  footerLink: { color: Colors.primary, fontSize: 14, fontWeight: '600' },
})
