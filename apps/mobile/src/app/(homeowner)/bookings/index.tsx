import { View, Text, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Colors } from '@/constants/colors'
import { FontSize, Spacing } from '@/constants/theme'
import { listBookings, updateBookingStatus } from '@/lib/api/bookings'
import { Button } from '@/components/ui/Button'
import { QueryScreen } from '@/components/common/QueryScreen'
import { BookingCard } from '@/components/bookings/BookingCard'

export default function HomeownerBookingsScreen() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['bookings', 'homeowner'],
    queryFn: () => listBookings(),
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'accepted' | 'rejected' | 'completed' }) =>
      updateBookingStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
    onError: (e: Error) => Alert.alert('Error', e.message),
  })

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Booking Requests</Text>
      <QueryScreen
        isLoading={isLoading}
        isError={isError}
        isEmpty={!isLoading && !isError && !data?.length}
        emptyTitle="No requests"
        emptyMessage="Incoming bookings appear here"
        onRetry={() => refetch()}
        refreshing={isRefetching}
        onRefresh={refetch}
      >
        <FlatList
          data={data || []}
          keyExtractor={(b) => b.id}
          renderItem={({ item }) => (
            <BookingCard booking={item}>
              {item.status === 'pending' && (
                <View style={styles.row}>
                  <View style={styles.half}>
                    <Button
                      title="Accept"
                      onPress={() => statusMutation.mutate({ id: item.id, status: 'accepted' })}
                      loading={statusMutation.isPending}
                    />
                  </View>
                  <View style={styles.half}>
                    <Button
                      title="Reject"
                      variant="outline"
                      onPress={() => statusMutation.mutate({ id: item.id, status: 'rejected' })}
                      disabled={statusMutation.isPending}
                    />
                  </View>
                </View>
              )}
              {item.status === 'accepted' && (
                <Button
                  title="Mark completed"
                  onPress={() => statusMutation.mutate({ id: item.id, status: 'completed' })}
                  loading={statusMutation.isPending}
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
  title: {
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Colors.text,
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  list: { padding: Spacing.md, paddingBottom: 24 },
  row: { flexDirection: 'row', gap: 8 },
  half: { flex: 1 },
})
