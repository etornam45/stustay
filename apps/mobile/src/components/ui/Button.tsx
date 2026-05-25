import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { Colors } from '../../constants/colors'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  disabled?: boolean
  loading?: boolean
  loadingTitle?: string
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  loadingTitle,
}: ButtonProps) {
  const isDisabled = disabled || loading
  const label = loading ? (loadingTitle ?? title) : title

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? Colors.primary : '#fff'} />
      ) : (
        <Text style={[styles.text, variant === 'outline' && styles.outlineText]}>{label}</Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, alignItems: 'center' },
  primary: { backgroundColor: Colors.primary },
  secondary: { backgroundColor: Colors.primaryDark },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.primary },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
  text: { color: '#fff', fontSize: 16, fontWeight: '600' },
  outlineText: { color: Colors.primary },
})
