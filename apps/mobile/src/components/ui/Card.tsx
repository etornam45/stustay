import type { ReactNode } from 'react'
import { View, StyleSheet } from 'react-native'
import { Colors } from '../../constants/colors'

interface CardProps {
  children: ReactNode
}

export function Card({ children }: CardProps) {
  return <View style={styles.card}>{children}</View>
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.surface, borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
})
