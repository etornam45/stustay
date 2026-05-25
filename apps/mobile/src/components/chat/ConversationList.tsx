import { View, Text, FlatList, Pressable, StyleSheet, RefreshControl } from 'react-native'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import type { Conversation } from '@stustay/shared'
import { Colors } from '@/constants/colors'
import { FontSize, Spacing } from '@/constants/theme'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ErrorState } from '@/components/common/ErrorState'
import { timeAgo } from '@/lib/utils/timeAgo'

interface ConversationListProps {
  chatBasePath: '/(student)/chats' | '/(homeowner)/chats'
  emptyMessage: string
  isLoading: boolean
  isError: boolean
  isRefetching: boolean
  data?: Conversation[]
  refetch: () => void
}

export function ConversationList({
  chatBasePath,
  emptyMessage,
  isLoading,
  isError,
  isRefetching,
  data,
  refetch,
}: ConversationListProps) {
  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <FlatList
      data={data || []}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable
          style={styles.row}
          onPress={() => router.push(`${chatBasePath}/${item.id}`)}
        >
          {item.listing_image_url ? (
            <Image source={{ uri: item.listing_image_url }} style={styles.thumb} contentFit="cover" />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(item.other_user_name || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {item.listing_title || item.other_user_name || 'Chat'}
            </Text>
            <Text style={styles.preview} numberOfLines={1}>
              {item.last_message?.body || 'No messages yet'}
            </Text>
          </View>
          <Text style={styles.time}>
            {timeAgo(item.last_message?.sent_at || item.created_at)}
          </Text>
        </Pressable>
      )}
      ListEmptyComponent={<EmptyState title="No chats" message={emptyMessage} />}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
    />
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },
  thumb: { width: 48, height: 48, borderRadius: 8, marginRight: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  info: { flex: 1, marginRight: 8 },
  name: { fontSize: FontSize.bodyLarge, fontWeight: '600', color: Colors.text },
  preview: { fontSize: FontSize.body, color: Colors.textSecondary, marginTop: 2 },
  time: { fontSize: FontSize.caption, color: Colors.textSecondary },
})
