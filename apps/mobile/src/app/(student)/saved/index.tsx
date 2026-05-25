import { useState, useCallback } from 'react'
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { Colors } from '@/constants/colors'
import { FontSize, Spacing } from '@/constants/theme'
import { ListingCard } from '@/components/listings/ListingCard'
import { TabSwitcher } from '@/components/common/TabSwitcher'
import { QueryScreen } from '@/components/common/QueryScreen'
import { getSavedListings } from '@/lib/api/saved'
import { getRecentlyViewed } from '@/lib/utils/recentlyViewed'
import type { Listing } from '@stustay/shared'

export default function SavedScreen() {
  const [tab, setTab] = useState('saved')
  const [recent, setRecent] = useState<Listing[]>([])
  const [refreshingRecent, setRefreshingRecent] = useState(false)

  const { data: saved, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['saved'],
    queryFn: getSavedListings,
  })

  async function loadRecent() {
    setRecent(await getRecentlyViewed())
  }

  useFocusEffect(
    useCallback(() => {
      loadRecent()
    }, [])
  )

  async function refreshRecent() {
    setRefreshingRecent(true)
    try {
      await loadRecent()
    } finally {
      setRefreshingRecent(false)
    }
  }

  const list = tab === 'saved' ? saved || [] : recent
  const isSavedTab = tab === 'saved'

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Saved</Text>
      <View style={styles.tabsWrap}>
        <TabSwitcher
          tabs={[
            { key: 'saved', label: 'Saved' },
            { key: 'recent', label: 'Recently Viewed' },
          ]}
          activeKey={tab}
          onChange={setTab}
        />
      </View>
      {isSavedTab ? (
        <QueryScreen
          isLoading={isLoading}
          isError={isError}
          isEmpty={!isLoading && !isError && !list.length}
          emptyTitle="Nothing saved"
          emptyMessage="Save listings to see them here"
          onRetry={() => refetch()}
          refreshing={isRefetching}
          onRefresh={refetch}
        >
          <FlatList
            data={list}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ListingCard listing={item} />}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
            contentContainerStyle={styles.list}
          />
        </QueryScreen>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ListingCard listing={item} />}
          contentContainerStyle={[styles.list, !list.length && styles.listEmpty]}
          refreshControl={
            <RefreshControl refreshing={refreshingRecent} onRefresh={refreshRecent} />
          }
          ListEmptyComponent={
            <View style={styles.emptyRecent}>
              <Text style={styles.emptyText}>Browse listings to build history</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  title: {
    fontSize: FontSize.screenTitle,
    fontWeight: '700',
    color: Colors.text,
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  tabsWrap: { paddingHorizontal: Spacing.md },
  list: { paddingHorizontal: Spacing.md, paddingBottom: 24 },
  listEmpty: { flexGrow: 1 },
  emptyRecent: { padding: Spacing.xl, alignItems: 'center' },
  emptyText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
})
