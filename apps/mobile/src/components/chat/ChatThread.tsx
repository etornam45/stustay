import { useRef, useEffect } from 'react'
import { FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform, View, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Colors } from '@/constants/colors'
import { getMessages, sendMessage } from '@/lib/api/messages'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { ChatInput } from '@/components/chat/ChatInput'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ErrorState } from '@/components/common/ErrorState'
import { useAuthStore } from '@/lib/store/authStore'

interface ChatThreadProps {
  conversationId: string
  title?: string
}

export function ChatThread({ conversationId, title = 'Chat' }: ChatThreadProps) {
  const userId = useAuthStore((s) => s.user?.id)
  const queryClient = useQueryClient()
  const listRef = useRef<FlatList>(null)

  const { data: messages, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId,
    refetchInterval: 5000,
  })

  const sendMutation = useMutation({
    mutationFn: (body: string) => sendMessage(conversationId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })

  useEffect(() => {
    if (messages?.length) {
      listRef.current?.scrollToEnd({ animated: true })
    }
  }, [messages?.length])

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={title} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <FlatList
            ref={listRef}
            data={messages || []}
            keyExtractor={(m) => m.id}
            renderItem={({ item }) => (
              <MessageBubble message={item} isOwn={item.sender_id === userId} />
            )}
            contentContainerStyle={styles.list}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
            ListEmptyComponent={
              <View style={styles.emptyThread}>
                <Text style={styles.emptyText}>Send a message to start the conversation</Text>
              </View>
            }
          />
        )}
        <ChatInput onSend={(text) => sendMutation.mutate(text)} disabled={sendMutation.isPending} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  list: { paddingVertical: 12, flexGrow: 1 },
  emptyThread: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
})
