import { Colors } from '@/constants/colors'
import { FontSize, Spacing } from '@/constants/theme'
import { router } from 'expo-router'
import type { ReactNode } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

interface ScreenHeaderProps {
  title: string
  onBack?: () => void
  showBack?: boolean
  rightAction?: ReactNode
}

export function ScreenHeader({ title, onBack, showBack = true, rightAction }: ScreenHeaderProps) {
  const handleBack = onBack ?? (() => router.back())

  return (
    <View style={styles.container}>
      {showBack ? (
        <Pressable onPress={handleBack} style={styles.backBtn} hitSlop={8}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
      ) : (
        <View style={styles.backPlaceholder} />
      )}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.right}>{rightAction ?? <View style={styles.backPlaceholder} />}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    // backgroundColor: Colors.surface,
  },
  backBtn: { minWidth: 72 },
  backPlaceholder: { minWidth: 72 },
  backText: { fontSize: FontSize.bodyLarge, color: Colors.primary, fontWeight: '600' },
  title: {
    flex: 1,
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  right: { minWidth: 72, alignItems: 'flex-end' },
})
