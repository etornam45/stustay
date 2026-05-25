import { useState, useEffect, useMemo } from 'react'
import { View, Text, TextInput, FlatList, StyleSheet, Pressable, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { Colors } from '@/constants/colors'
import { FontSize, Spacing } from '@/constants/theme'
import { ListingCard } from '@/components/listings/ListingCard'
import { QueryScreen } from '@/components/common/QueryScreen'
import { searchListings } from '@/lib/api/listings'
import { useFilterStore } from '@/lib/store/filterStore'

function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function SearchScreen() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query)
  const filters = useFilterStore()

  const params = useMemo(
    () => ({
      query: debouncedQuery || undefined,
      min_price: filters.minPrice ?? undefined,
      max_price: filters.maxPrice ?? undefined,
      bedrooms: filters.bedrooms ?? undefined,
      is_furnished: filters.isFurnished ?? undefined,
      has_wifi: filters.hasWifi ?? undefined,
      has_security: filters.hasSecurity ?? undefined,
      has_backup_power: filters.hasBackupPower ?? undefined,
      has_water: filters.hasWater ?? undefined,
    }),
    [debouncedQuery, filters]
  )

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['listings', 'search', params],
    queryFn: () => searchListings(params),
  })

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Search</Text>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search listings..."
          value={query}
          onChangeText={setQuery}
          placeholderTextColor={Colors.textSecondary}
        />
        <Pressable style={styles.filterBtn} onPress={() => router.push('/(student)/search/filters')}>
          <Text style={styles.filterText}>Filters</Text>
        </Pressable>
      </View>
      <QueryScreen
        isLoading={isLoading}
        isError={isError}
        isEmpty={!isLoading && !isError && !(data?.length)}
        emptyTitle="No listings"
        emptyMessage="Try adjusting your filters"
        onRetry={() => refetch()}
        refreshing={isRefetching}
        onRefresh={refetch}
      >
        <FlatList
          data={data || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ListingCard listing={item} />}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          contentContainerStyle={styles.list}
        />
      </QueryScreen>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  screenTitle: {
    fontSize: FontSize.screenTitle,
    fontWeight: '700',
    color: Colors.text,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  searchRow: { flexDirection: 'row', padding: Spacing.md, gap: 8, alignItems: 'center' },
  searchBar: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: FontSize.bodyLarge,
  },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 12, backgroundColor: Colors.primary, borderRadius: 10 },
  filterText: { color: '#fff', fontWeight: '600' },
  list: { paddingHorizontal: Spacing.md, paddingBottom: 24 },
})
