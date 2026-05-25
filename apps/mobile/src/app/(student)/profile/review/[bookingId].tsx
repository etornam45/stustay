import { useState } from 'react'
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { Colors } from '@/constants/colors'
import { Spacing } from '@/constants/theme'
import { createReview } from '@/lib/api/reviews'

export default function ReviewScreen() {
  const { bookingId, listingId, revieweeId, listingTitle } = useLocalSearchParams<{
    bookingId: string
    listingId: string
    revieweeId: string
    listingTitle?: string
  }>()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!bookingId || !listingId || !revieweeId) return
    setLoading(true)
    try {
      await createReview({
        booking_id: bookingId,
        listing_id: listingId,
        reviewee_id: revieweeId,
        rating,
        comment: comment.trim() || undefined,
      })
      Alert.alert('Thank you!', 'Your review was submitted.', [
        { text: 'OK', onPress: () => router.back() },
      ])
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Leave a review" />
      <View style={styles.content}>
        {listingTitle ? <Text style={styles.subtitle}>{listingTitle}</Text> : null}

        <Text style={styles.label}>Rating</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Pressable key={n} onPress={() => setRating(n)}>
              <Text style={[styles.star, n <= rating && styles.starActive]}>★</Text>
            </Pressable>
          ))}
        </View>

        <Input
          label="Comment (optional)"
          value={comment}
          onChangeText={setComment}
          placeholder="Share your experience..."
        />

        <Button
          title="Submit review"
          onPress={handleSubmit}
          loading={loading}
          loadingTitle="Submitting…"
        />
        <Button title="Cancel" variant="outline" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, gap: Spacing.md },
  subtitle: { fontSize: 15, color: Colors.textSecondary },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text },
  stars: { flexDirection: 'row', gap: 8 },
  star: { fontSize: 36, color: Colors.border },
  starActive: { color: Colors.warning },
})
