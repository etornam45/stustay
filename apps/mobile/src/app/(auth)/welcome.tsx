import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Button } from '@/components/ui/Button'
import { Colors } from '@/constants/colors'

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>StuStay</Text>
        <Text style={styles.subtitle}>Find your perfect student accommodation</Text>
      </View>
      <View style={styles.actions}>
        <Button title="I'm a Student" onPress={() => router.push('/(auth)/register?role=student')} />
        <Button title="I'm a Homeowner" onPress={() => router.push('/(auth)/register?role=homeowner')} variant="secondary" />
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Text style={styles.loginLink} onPress={() => router.push('/(auth)/login')}>Sign In</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface, padding: 24 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 42, fontWeight: '700', color: Colors.primary, marginBottom: 12 },
  subtitle: { fontSize: 18, color: Colors.textSecondary, textAlign: 'center' },
  actions: { gap: 12, paddingBottom: 32 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  loginText: { color: Colors.textSecondary, fontSize: 14 },
  loginLink: { color: Colors.primary, fontSize: 14, fontWeight: '600' },
})
