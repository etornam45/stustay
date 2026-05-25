import { View, Text, ScrollView, Switch, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Button } from '@/components/ui/Button'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { Colors } from '@/constants/colors'
import { Spacing } from '@/constants/theme'
import { useFilterStore } from '@/lib/store/filterStore'
import { Input } from '@/components/ui/Input'

export default function FiltersScreen() {
  const {
    minPrice,
    maxPrice,
    bedrooms,
    isFurnished,
    hasWifi,
    hasSecurity,
    hasBackupPower,
    hasWater,
    setFilter,
    resetFilters,
  } = useFilterStore()

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Filters" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.section}>Price Range</Text>
        <View style={styles.row}>
          <View style={styles.half}>
            <Input
              label="Min (Ghc)"
              value={minPrice?.toString() || ''}
              onChangeText={(v) => setFilter('minPrice', v ? parseInt(v) : null)}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.half}>
            <Input
              label="Max (Ghc)"
              value={maxPrice?.toString() || ''}
              onChangeText={(v) => setFilter('maxPrice', v ? parseInt(v) : null)}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <Text style={styles.section}>Bedrooms</Text>
        <View style={styles.chipRow}>
          {[1, 2, 3, 4].map((n) => (
            <Text
              key={n}
              style={[styles.chip, bedrooms === n && styles.chipActive]}
              onPress={() => setFilter('bedrooms', bedrooms === n ? null : n)}
            >
              {n}
            </Text>
          ))}
        </View>

        <Text style={styles.section}>Amenities</Text>
        <View style={styles.switchRow}>
          <Text>Furnished</Text>
          <Switch value={isFurnished ?? false} onValueChange={(v) => setFilter('isFurnished', v || null)} />
        </View>
        <View style={styles.switchRow}>
          <Text>WiFi</Text>
          <Switch value={hasWifi ?? false} onValueChange={(v) => setFilter('hasWifi', v || null)} />
        </View>
        <View style={styles.switchRow}>
          <Text>Security</Text>
          <Switch value={hasSecurity ?? false} onValueChange={(v) => setFilter('hasSecurity', v || null)} />
        </View>
        <View style={styles.switchRow}>
          <Text>Backup power</Text>
          <Switch value={hasBackupPower ?? false} onValueChange={(v) => setFilter('hasBackupPower', v || null)} />
        </View>
        <View style={styles.switchRow}>
          <Text>Water</Text>
          <Switch value={hasWater ?? false} onValueChange={(v) => setFilter('hasWater', v || null)} />
        </View>

        <Button title="Apply Filters" onPress={() => router.back()} />
        <View style={{ height: 8 }} />
        <Button title="Reset" variant="outline" onPress={resetFilters} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: Spacing.md, paddingBottom: 32 },
  section: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 12, marginTop: 8 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 16,
    color: Colors.text,
    overflow: 'hidden',
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary, color: '#fff' },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
})
