import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import type { Listing } from '@stustay/shared'
import { Colors } from '@/constants/colors'
import { Spacing } from '@/constants/theme'
import { StatusBadge } from '@/components/common/StatusBadge'
import { formatPrice } from '@/lib/utils/formatPrice'

interface HomeownerListingRowProps {
  listing: Listing
}

export function HomeownerListingRow({ listing }: HomeownerListingRowProps) {
  const imageUrl = listing.images?.find((i) => i.is_primary)?.url || listing.images?.[0]?.url

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/(homeowner)/listings/${listing.id}/edit`)}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.thumb} contentFit="cover" />
      ) : (
        <View style={[styles.thumb, styles.placeholder]}>
          <Text style={styles.placeholderText}>No image</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {listing.title}
        </Text>
        <StatusBadge status={listing.status} />
        <Text style={styles.price}>{formatPrice(listing.price_per_semester)}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    gap: Spacing.md,
  },
  thumb: { width: 72, height: 72, borderRadius: 8 },
  placeholder: { backgroundColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 11, color: Colors.textSecondary },
  info: { flex: 1, gap: 6 },
  title: { fontSize: 16, fontWeight: '600', color: Colors.text },
  price: { fontSize: 14, fontWeight: '600', color: Colors.primary },
})
