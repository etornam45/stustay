import { View, Text, Pressable, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import type { SavedAccount } from '@/lib/store/authStore'
import { useAuthStore } from '@/lib/store/authStore'
import { switchAccount } from '@/lib/auth/signOut'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Colors } from '@/constants/colors'
import { FontSize, Spacing } from '@/constants/theme'

function roleLabel(role: string) {
  if (role === 'homeowner') return 'Homeowner'
  if (role === 'student') return 'Student'
  return role
}

interface AccountSwitcherProps {
  onRemoveAccount?: (userId: string) => void
}

export function AccountSwitcher({ onRemoveAccount }: AccountSwitcherProps) {
  const user = useAuthStore((s) => s.user)
  const savedAccounts = useAuthStore((s) => s.savedAccounts)

  if (savedAccounts.length === 0) return null

  async function handleSwitch(account: SavedAccount) {
    if (account.userId === user?.id) return
    await switchAccount(account.userId)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Accounts</Text>
      <Card>
        {savedAccounts.map((account) => {
          const active = account.userId === user?.id
          return (
            <View key={account.userId} style={[styles.row, active && styles.rowActive]}>
              <Pressable style={styles.rowMain} onPress={() => handleSwitch(account)}>
                <Text style={styles.rowName}>{account.user.full_name}</Text>
                <Text style={styles.rowMeta}>
                  {roleLabel(account.user.role)} · {account.user.email}
                </Text>
              </Pressable>
              {active ? (
                <Text style={styles.activeBadge}>Active</Text>
              ) : onRemoveAccount ? (
                <Pressable onPress={() => onRemoveAccount(account.userId)} hitSlop={8}>
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              ) : null}
            </View>
          )
        })}
      </Card>
      <Button title="Add account" variant="outline" onPress={() => router.push('/(auth)/login')} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: Spacing.md, marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSize.bodyLarge, fontWeight: '600', color: Colors.text },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowActive: { backgroundColor: '#f0fdf4', marginHorizontal: -8, paddingHorizontal: 8, borderRadius: 8 },
  rowMain: { flex: 1, marginRight: Spacing.sm },
  rowName: { fontSize: FontSize.bodyLarge, fontWeight: '600', color: Colors.text },
  rowMeta: { fontSize: FontSize.caption, color: Colors.textSecondary, marginTop: 2 },
  activeBadge: {
    fontSize: FontSize.caption,
    fontWeight: '600',
    color: Colors.primary,
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  removeText: { fontSize: FontSize.caption, color: Colors.error, fontWeight: '600' },
})
