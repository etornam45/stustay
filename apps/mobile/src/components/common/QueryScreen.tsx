import type { ReactNode } from 'react'
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native'
import { LoadingSpinner } from './LoadingSpinner'
import { ErrorState } from './ErrorState'
import { EmptyState } from './EmptyState'

interface QueryScreenProps {
  isLoading: boolean
  isError: boolean
  isEmpty?: boolean
  errorMessage?: string
  emptyTitle?: string
  emptyMessage?: string
  onRetry?: () => void
  refreshing?: boolean
  onRefresh?: () => void
  children: ReactNode
}

export function QueryScreen({
  isLoading,
  isError,
  isEmpty,
  errorMessage,
  emptyTitle = 'Nothing here',
  emptyMessage,
  onRetry,
  refreshing = false,
  onRefresh,
  children,
}: QueryScreenProps) {
  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorState message={errorMessage} onRetry={onRetry} />
  if (isEmpty) {
    if (onRefresh) {
      return (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.emptyContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <EmptyState title={emptyTitle} message={emptyMessage} />
        </ScrollView>
      )
    }
    return <EmptyState title={emptyTitle} message={emptyMessage} />
  }
  return <View style={styles.flex}>{children}</View>
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  emptyContainer: { flexGrow: 1 },
})
