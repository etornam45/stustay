import type { ReactNode } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import type { BookingWithListing } from '@/lib/api/bookings'
import { Colors } from '@/constants/colors'
import { Spacing } from '@/constants/theme'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/Button'

interface BookingCardProps {
  booking: BookingWithListing
  subtitle?: string
  children?: ReactNode
}

export function BookingCard({ booking, subtitle, children }: BookingCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.listingTitle}>{booking.listing_title || 'Listing'}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <Text style={styles.meta}>
        {booking.semester} · {booking.academic_year}
      </Text>
      {booking.message ? <Text style={styles.message}>{booking.message}</Text> : null}
      <StatusBadge status={booking.status} />
      {children ? <View style={styles.actions}>{children}</View> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  listingTitle: { fontSize: 16, fontWeight: '600', color: Colors.text },
  subtitle: { fontSize: 14, color: Colors.textSecondary },
  meta: { fontSize: 14, color: Colors.textSecondary },
  message: { fontSize: 14, color: Colors.text, fontStyle: 'italic' },
  actions: { marginTop: Spacing.sm, gap: Spacing.sm },
})
