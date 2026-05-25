import { Colors } from '@/constants/colors'
import { formatPrice } from '@/lib/utils/formatPrice'
import {
  Bathtub01Icon,
  BedSingle01Icon,
  Location01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import type { Listing } from '@stustay/shared'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'

interface ListingCardProps {
  listing: Listing
  horizontal?: boolean
}

function MetaItem({ icon, label }: { icon: typeof BedSingle01Icon; label: string }) {
  return (
    <View style={styles.metaItem}>
      <HugeiconsIcon icon={icon} size={14} color={Colors.textSecondary} />
      <Text style={styles.metaText}>{label}</Text>
    </View>
  )
}

export function ListingCard({ listing, horizontal }: ListingCardProps) {
  const imageUrl = listing.images?.find((i) => i.is_primary)?.url || listing.images?.[0]?.url

  return (
    <Pressable
      style={[styles.card, horizontal && styles.horizontal]}
      onPress={() => router.push(`/(student)/listing/${listing.id}`)}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={horizontal ? styles.imageH : styles.image} contentFit="cover" />
      ) : (
        <View style={[horizontal ? styles.imageH : styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>No image</Text>
        </View>
      )}
      <View style={styles.info}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={styles.title} numberOfLines={1}>
            {listing.title}
          </Text>
        <Text style={styles.price}>{formatPrice(listing.price_per_semester)}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <View style={styles.addressRow}>
              <HugeiconsIcon icon={Location01Icon} size={14} color={Colors.textSecondary} />
              <Text style={styles.address} numberOfLines={1}>
                {listing.address}
              </Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <MetaItem
              icon={BedSingle01Icon}
              label={`${listing.bedrooms} ${listing.bedrooms === 1 ? 'bed' : 'beds'}`}
            />
            <MetaItem
              icon={Bathtub01Icon}
              label={`${listing.bathrooms} ${listing.bathrooms === 1 ? 'bath' : 'baths'}`}
            />
          </View>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  horizontal: { width: 260, marginRight: 12 },
  image: { width: '100%', height: 160 },
  imageH: { width: '100%', height: 140 },
  placeholder: { backgroundColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: Colors.textSecondary },
  info: {
    padding: 12,
    paddingVertical: 8,
  },
  price: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  title: { fontSize: 12, fontWeight: '600', color: Colors.text, marginTop: 4 },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  address: { flex: 1, fontSize: 13, color: Colors.textSecondary },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
})
