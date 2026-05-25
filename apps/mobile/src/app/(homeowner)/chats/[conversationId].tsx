import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { getConversations } from '@/lib/api/messages'
import { ChatThread } from '@/components/chat/ChatThread'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export default function HomeownerChatThreadScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>()
  const { data, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  })

  const conv = data?.find((c) => c.id === conversationId)
  const title = conv?.listing_title || conv?.other_user_name || 'Chat'

  if (isLoading && !conv) return <LoadingSpinner />

  return <ChatThread conversationId={conversationId!} title={title} />
}
