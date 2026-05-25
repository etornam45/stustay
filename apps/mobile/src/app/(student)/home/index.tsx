import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ListingCard } from '@/components/listings/ListingCard'
import { Colors } from '@/constants/colors'
import { FontSize, Spacing } from '@/constants/theme'
import { searchListings } from '@/lib/api/listings'
import { useFilterStore } from '@/lib/store/filterStore'
import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function StudentHomeScreen() {
  const setFilter = useFilterStore((s) => s.setFilter)
  const resetFilters = useFilterStore((s) => s.resetFilters)

  const { data: listings, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['listings', 'home'],
    queryFn: () => searchListings(),
  })

  const featured = listings?.[0]
  const popular = listings?.slice(1, 6) || []

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          contentContainerStyle={[
            styles.scrollContent,
            (!listings?.length || isError) && styles.scrollEmpty,
          ]}
        >
          {isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : !listings?.length ? (
            <EmptyState title="No listings yet" message="Check back soon or try search" />
          ) : (
            <>
          <View style={styles.header}>
            <Text style={styles.greeting}>Find your</Text>
            <Text style={styles.title}>Perfect Stay</Text>
          </View>
          <Pressable onPress={() => router.push('/(student)/search')}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search by location, price..."
              placeholderTextColor={Colors.textSecondary}
              editable={false}
              pointerEvents="none"
            />
          </Pressable>
          <View style={styles.chips}>
            <Pressable
              style={styles.chip}
              onPress={() => {
                resetFilters()
                router.push('/(student)/search')
              }}
            >
              <Text style={styles.chipText}>Browse All</Text>
            </Pressable>
            <Pressable
              style={styles.chip}
              onPress={() => {
                resetFilters()
                setFilter('bedrooms', 1)
                router.push('/(student)/search')
              }}
            >
              <Text style={styles.chipText}>1 Bedroom</Text>
            </Pressable>
            <Pressable
              style={styles.chip}
              onPress={() => {
                resetFilters()
                setFilter('bedrooms', 2)
                router.push('/(student)/search')
              }}
            >
              <Text style={styles.chipText}>2+ Bedrooms</Text>
            </Pressable>
          </View>
          {featured && (
            <>
              <Text style={styles.sectionTitle}>Featured</Text>
              <ListingCard listing={featured} />
            </>
          )}
          {popular.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>More Listings</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled>
                {popular.map((l) => (
                  <ListingCard key={l.id} listing={l} horizontal />
                ))}
              </ScrollView>
            </>
          )}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: Spacing.md, paddingBottom: Spacing.sm },
  scrollEmpty: { flexGrow: 1 },
  header: { marginBottom: Spacing.md },
  greeting: { fontSize: FontSize.bodyLarge, color: Colors.textSecondary },
  title: { fontSize: FontSize.screenTitle, fontWeight: '700', color: Colors.text },
  searchBar: {
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 12,
    fontSize: FontSize.bodyLarge,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chips: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipText: { fontSize: FontSize.body, color: Colors.text },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: Colors.text, marginBottom: 12 },
})
