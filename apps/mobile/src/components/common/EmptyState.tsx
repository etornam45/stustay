import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '../../constants/colors'

interface EmptyStateProps {
  title: string
  message?: string
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  title: { fontSize: 18, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  message: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
})
