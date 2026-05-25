import { View, Text, StyleSheet } from 'react-native'
import { HugeiconsIcon } from '@hugeicons/react-native'
import {
  BedSingle01Icon,
  Bathtub01Icon,
  Sofa01Icon,
  Wifi01Icon,
  Shield01Icon,
  BatteryCharging01Icon,
  DropletIcon,
} from '@hugeicons/core-free-icons'
import type { Listing } from '@stustay/shared'
import { Colors } from '@/constants/colors'

interface AmenitiesRowProps {
  listing: Listing
}

type IconType = typeof BedSingle01Icon

function AmenityChip({ icon, label }: { icon: IconType; label: string }) {
  return (
    <View style={styles.chip}>
      <HugeiconsIcon icon={icon} size={16} color={Colors.primary} />
      <Text style={styles.chipText}>{label}</Text>
    </View>
  )
}

export function AmenitiesRow({ listing }: AmenitiesRowProps) {
  const items: { icon: IconType; label: string }[] = [
    {
      icon: BedSingle01Icon,
      label: `${listing.bedrooms} ${listing.bedrooms === 1 ? 'bed' : 'beds'}`,
    },
    {
      icon: Bathtub01Icon,
      label: `${listing.bathrooms} ${listing.bathrooms === 1 ? 'bath' : 'baths'}`,
    },
  ]

  if (listing.is_furnished) items.push({ icon: Sofa01Icon, label: 'Furnished' })
  if (listing.has_wifi) items.push({ icon: Wifi01Icon, label: 'WiFi' })
  if (listing.has_security) items.push({ icon: Shield01Icon, label: 'Security' })
  if (listing.has_backup_power) items.push({ icon: BatteryCharging01Icon, label: 'Backup power' })
  if (listing.has_water) items.push({ icon: DropletIcon, label: 'Water' })

  return (
    <View style={styles.row}>
      {items.map((item) => (
        <AmenityChip key={item.label} icon={item.icon} label={item.label} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipText: { fontSize: 13, color: Colors.text, fontWeight: '500' },
})
