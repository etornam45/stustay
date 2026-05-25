import { View, Text, StyleSheet, Pressable, ScrollView, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { Colors } from '@/constants/colors'
import { FontSize, Spacing } from '@/constants/theme'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ErrorState } from '@/components/common/ErrorState'
import { searchListings } from '@/lib/api/listings'
import { listBookings } from '@/lib/api/bookings'
import { getConversations } from '@/lib/api/messages'

export default function DashboardScreen() {
  const listingsQuery = useQuery({
    queryKey: ['listings', 'mine'],
    queryFn: () => searchListings({ mine: true }),
  })
  const bookingsQuery = useQuery({
    queryKey: ['bookings', 'homeowner'],
    queryFn: () => listBookings(),
  })
  const chatsQuery = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  })

  const isLoading = listingsQuery.isLoading || bookingsQuery.isLoading || chatsQuery.isLoading
  const isError = listingsQuery.isError || bookingsQuery.isError || chatsQuery.isError
  const isRefetching =
    listingsQuery.isRefetching || bookingsQuery.isRefetching || chatsQuery.isRefetching

  const listings = listingsQuery.data
  const bookings = bookingsQuery.data
  const chats = chatsQuery.data

  const active = listings?.filter((l) => l.status === 'approved').length ?? 0
  const pending = bookings?.filter((b) => b.status === 'pending').length ?? 0

  function retryAll() {
    listingsQuery.refetch()
    bookingsQuery.refetch()
    chatsQuery.refetch()
  }

  if (isLoading) return <LoadingSpinner />

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState onRetry={retryAll} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={retryAll} />}
      >
        <Text style={styles.title}>Dashboard</Text>
      <View style={styles.statsRow}>
        <Pressable style={styles.statPress} onPress={() => router.push('/(homeowner)/listings')}>
          <Card>
            <Text style={styles.statValue}>{active}</Text>
            <Text style={styles.statLabel}>Active Listings</Text>
          </Card>
        </Pressable>
        <Pressable style={styles.statPress} onPress={() => router.push('/(homeowner)/bookings')}>
          <Card>
            <Text style={styles.statValue}>{pending}</Text>
            <Text style={styles.statLabel}>Pending Requests</Text>
          </Card>
        </Pressable>
      </View>
      <View style={styles.statsRow}>
        <Pressable style={styles.statPress} onPress={() => router.push('/(homeowner)/bookings')}>
          <Card>
            <Text style={styles.statValue}>{bookings?.length ?? 0}</Text>
            <Text style={styles.statLabel}>Total Bookings</Text>
          </Card>
        </Pressable>
        <Pressable style={styles.statPress} onPress={() => router.push('/(homeowner)/chats')}>
          <Card>
            <Text style={styles.statValue}>{chats?.length ?? 0}</Text>
            <Text style={styles.statLabel}>Messages</Text>
          </Card>
        </Pressable>
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.md, paddingBottom: 32 },
  title: { fontSize: FontSize.screenTitle, fontWeight: '700', color: Colors.text, marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statPress: { flex: 1 },
  statValue: { fontSize: 28, fontWeight: '700', color: Colors.primary },
  statLabel: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
})
