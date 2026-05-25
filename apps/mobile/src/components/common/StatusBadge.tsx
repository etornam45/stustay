import { Text, StyleSheet } from 'react-native'
import { Colors } from '@/constants/colors'
import type { BookingStatus } from '@stustay/shared'

type ListingStatus = 'pending' | 'approved' | 'rejected' | 'archived'

interface StatusBadgeProps {
  status: BookingStatus | ListingStatus | string
}

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#fef3c7', text: Colors.warning },
  accepted: { bg: '#d1fae5', text: Colors.primary },
  approved: { bg: '#d1fae5', text: Colors.primary },
  rejected: { bg: '#fee2e2', text: Colors.error },
  cancelled: { bg: '#f3f4f6', text: Colors.textSecondary },
  completed: { bg: '#d1fae5', text: Colors.primaryDark },
  archived: { bg: '#f3f4f6', text: Colors.textSecondary },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors = statusColors[status] ?? { bg: '#f3f4f6', text: Colors.textSecondary }

  return (
    <Text style={[styles.badge, { backgroundColor: colors.bg, color: colors.text }]}>
      {status}
    </Text>
  )
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
})
