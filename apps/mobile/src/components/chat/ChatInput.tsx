import { useState } from 'react'
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native'
import { Colors } from '@/constants/colors'

interface ChatInputProps {
  onSend: (text: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState('')

  function handleSend() {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText('')
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type a message..."
        placeholderTextColor={Colors.textSecondary}
        editable={!disabled}
      />
      <Pressable style={[styles.send, disabled && styles.disabled]} onPress={handleSend} disabled={disabled}>
        <Text style={styles.sendText}>Send</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: Colors.border, gap: 8, backgroundColor: Colors.background },
  input: { flex: 1, backgroundColor: Colors.surface, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, borderWidth: 1, borderColor: Colors.border },
  send: { justifyContent: 'center', paddingHorizontal: 16, backgroundColor: Colors.primary, borderRadius: 20 },
  sendText: { color: '#fff', fontWeight: '600' },
  disabled: { opacity: 0.5 },
})
