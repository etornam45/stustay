import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '@/constants/colors'
import { FontSize, Spacing } from '@/constants/theme'
import { Button } from '@/components/ui/Button'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unable to load</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && <Button title="Try again" onPress={onRetry} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  title: { fontSize: FontSize.bodyLarge, fontWeight: '600', color: Colors.text },
  message: { fontSize: FontSize.body, color: Colors.textSecondary, textAlign: 'center' },
})
