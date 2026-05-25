import { View, Text, StyleSheet } from 'react-native'
import type { Message } from '@stustay/shared'
import { Colors } from '@/constants/colors'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <View style={[styles.row, isOwn && styles.rowOwn]}>
      <View style={[styles.bubble, isOwn ? styles.own : styles.other]}>
        <Text style={[styles.text, isOwn && styles.textOwn]}>{message.body}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginVertical: 4, paddingHorizontal: 12 },
  rowOwn: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 16 },
  own: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  other: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderBottomLeftRadius: 4 },
  text: { fontSize: 15, color: Colors.text },
  textOwn: { color: '#fff' },
})
