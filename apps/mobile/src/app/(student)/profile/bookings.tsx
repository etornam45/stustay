import { FlatList, StyleSheet, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { Colors } from '@/constants/colors'
import { listBookings } from '@/lib/api/bookings'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { QueryScreen } from '@/components/common/QueryScreen'
import { BookingCard } from '@/components/bookings/BookingCard'
import { Button } from '@/components/ui/Button'

export default function StudentBookingsScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['bookings', 'student'],
    queryFn: () => listBookings(),
  })

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="My Bookings" />
      <QueryScreen
        isLoading={isLoading}
        isError={isError}
        isEmpty={!isLoading && !isError && !data?.length}
        emptyTitle="No bookings"
        emptyMessage="Book a viewing from a listing"
        onRetry={() => refetch()}
        refreshing={isRefetching}
        onRefresh={refetch}
      >
        <FlatList
          data={data || []}
          keyExtractor={(b) => b.id}
          renderItem={({ item }) => (
            <BookingCard booking={item}>
              {item.status === 'completed' && (
                <Button
                  title="Leave review"
                  onPress={() =>
                    router.push({
                      pathname: '/(student)/profile/review/[bookingId]',
                      params: {
                        bookingId: item.id,
                        listingId: item.listing_id,
                        revieweeId: item.homeowner_id,
                        listingTitle: item.listing_title || '',
                      },
                    })
                  }
                />
              )}
            </BookingCard>
          )}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        />
      </QueryScreen>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16, paddingBottom: 24 },
})
