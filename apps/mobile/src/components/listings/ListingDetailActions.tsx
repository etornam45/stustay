import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { BookmarkIcon, Message01Icon } from '@hugeicons/core-free-icons'
import { Colors } from '@/constants/colors'
import { FontSize, Spacing } from '@/constants/theme'

interface IconActionProps {
  icon: typeof BookmarkIcon
  label: string
  onPress: () => void
  loading?: boolean
  active?: boolean
}

function IconAction({ icon, label, onPress, loading, active }: IconActionProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.iconBtn,
        active && styles.iconBtnActive,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      disabled={loading}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator size="small" color={active ? Colors.primary : Colors.textSecondary} />
      ) : (
        <HugeiconsIcon
          icon={icon}
          size={22}
          color={active ? Colors.primary : Colors.text}
          strokeWidth={active ? 2 : 1.5}
        />
      )}
    </Pressable>
  )
}

interface ListingDetailActionsProps {
  priceLabel: string
  isSaved?: boolean
  onSave: () => void
  onChat: () => void
  onBook: () => void
  saveLoading?: boolean
  chatLoading?: boolean
}

export function ListingDetailActions({
  priceLabel,
  isSaved,
  onSave,
  onChat,
  onBook,
  saveLoading,
  chatLoading,
}: ListingDetailActionsProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        <View style={styles.priceBlock}>
          <Text style={styles.price} numberOfLines={1}>
            {priceLabel}
          </Text>
          <Text style={styles.priceMeta}>per semester</Text>
        </View>

        <View style={styles.iconGroup}>
          <IconAction
            icon={BookmarkIcon}
            label={isSaved ? 'Remove from saved' : 'Save listing'}
            onPress={onSave}
            loading={saveLoading}
            active={isSaved}
          />
          <IconAction
            icon={Message01Icon}
            label="Message host"
            onPress={onChat}
            loading={chatLoading}
          />
        </View>

        <Pressable style={({ pressed }) => [styles.bookBtn, pressed && styles.pressed]} onPress={onBook}>
          <Text style={styles.bookText}>Book viewing</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  priceBlock: {
    minWidth: 72,
    maxWidth: 100,
  },
  price: {
    fontSize: FontSize.bodyLarge,
    fontWeight: '700',
    color: Colors.text,
  },
  priceMeta: {
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  iconGroup: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: '#ecfdf5',
  },
  bookBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  bookText: {
    color: '#fff',
    fontSize: FontSize.bodyLarge,
    fontWeight: '700',
  },
  pressed: { opacity: 0.85 },
})
