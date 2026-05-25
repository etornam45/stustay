import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { Colors } from '@/constants/colors'
import { FontSize, Spacing } from '@/constants/theme'
import { searchListings } from '@/lib/api/listings'
import { Button } from '@/components/ui/Button'
import { QueryScreen } from '@/components/common/QueryScreen'
import { HomeownerListingRow } from '@/components/listings/HomeownerListingRow'

export default function HomeownerListingsScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['listings', 'mine'],
    queryFn: () => searchListings({ mine: true }),
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Listings</Text>
        <Button title="+ New" onPress={() => router.push('/(homeowner)/listings/new')} />
      </View>
      <QueryScreen
        isLoading={isLoading}
        isError={isError}
        isEmpty={!isLoading && !isError && !data?.length}
        emptyTitle="No listings"
        emptyMessage="Create your first listing"
        onRetry={() => refetch()}
        refreshing={isRefetching}
        onRefresh={refetch}
      >
        <FlatList
          data={data || []}
          keyExtractor={(l) => l.id}
          renderItem={({ item }) => <HomeownerListingRow listing={item} />}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          contentContainerStyle={styles.list}
        />
      </QueryScreen>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  title: { fontSize: FontSize.title, fontWeight: '700', color: Colors.text },
  list: { padding: Spacing.md, paddingTop: 0 },
})
