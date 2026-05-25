import { Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import { Colors } from '@/constants/colors'
import { FontSize, Spacing } from '@/constants/theme'
import { getConversations } from '@/lib/api/messages'
import { ConversationList } from '@/components/chat/ConversationList'

export default function HomeownerChatsScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
    refetchInterval: 10000,
  })

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <ConversationList
        chatBasePath="/(homeowner)/chats"
        emptyMessage="Chats appear when students message you"
        isLoading={isLoading}
        isError={isError}
        isRefetching={isRefetching}
        data={data}
        refetch={refetch}
      />
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
})
