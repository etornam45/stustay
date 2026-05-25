import { useState } from 'react'
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import { Colors } from '@/constants/colors'
import { FontSize, Spacing } from '@/constants/theme'

export interface SelectOption {
  label: string
  value: string
}

interface SelectFieldProps {
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  placeholder?: string
}

export function SelectField({ label, value, options, onChange, placeholder = 'Select…' }: SelectFieldProps) {
  const [open, setOpen] = useState(false)
  const selected = options.find((o) => o.value === value)

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.field} onPress={() => setOpen(true)}>
        <Text style={[styles.value, !selected && styles.placeholder]}>
          {selected?.label ?? placeholder}
        </Text>
        <Text style={styles.chevron}>▼</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.option, item.value === value && styles.optionActive]}
                  onPress={() => {
                    onChange(item.value)
                    setOpen(false)
                  }}
                >
                  <Text style={[styles.optionText, item.value === value && styles.optionTextActive]}>
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
            <Pressable style={styles.cancelBtn} onPress={() => setOpen(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  label: { fontSize: 14, fontWeight: '500', color: Colors.text, marginBottom: 6 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    backgroundColor: Colors.surface,
  },
  value: { fontSize: FontSize.bodyLarge, color: Colors.text, flex: 1 },
  placeholder: { color: Colors.textSecondary },
  chevron: { fontSize: 10, color: Colors.textSecondary, marginLeft: 8 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: Spacing.md,
    maxHeight: '60%',
  },
  sheetTitle: { fontSize: FontSize.title, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
  option: {
    paddingVertical: 14,
    paddingHorizontal: Spacing.sm,
    borderRadius: 8,
    marginBottom: 4,
  },
  optionActive: { backgroundColor: '#d1fae5' },
  optionText: { fontSize: FontSize.bodyLarge, color: Colors.text },
  optionTextActive: { color: Colors.primary, fontWeight: '600' },
  cancelBtn: { paddingVertical: 14, alignItems: 'center', marginTop: Spacing.sm },
  cancelText: { fontSize: FontSize.bodyLarge, color: Colors.textSecondary, fontWeight: '600' },
})
