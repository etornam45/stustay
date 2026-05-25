import { useState, useEffect } from 'react'
import { addRecentlyViewed } from '@/lib/utils/recentlyViewed'
import { View, Text, ScrollView, StyleSheet, Modal, Alert, RefreshControl } from 'react-native'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { Location01Icon } from '@hugeicons/core-free-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Colors } from '@/constants/colors'
import { Spacing } from '@/constants/theme'
import { formatPrice } from '@/lib/utils/formatPrice'
import { getListing } from '@/lib/api/listings'
import { createBooking } from '@/lib/api/bookings'
import { createConversation } from '@/lib/api/messages'
import { getSavedListings, toggleSavedListing } from '@/lib/api/saved'
import { ListingImageGallery } from '@/components/listings/ListingImageGallery'
import { AmenitiesRow } from '@/components/listings/AmenitiesRow'
import { ListingDetailActions } from '@/components/listings/ListingDetailActions'
import { SelectField } from '@/components/ui/SelectField'
import { SEMESTERS, ACADEMIC_YEARS, defaultAcademicYear } from '@stustay/shared'

const SEMESTER_OPTIONS = SEMESTERS.map((s) => ({ label: s, value: s }))
const ACADEMIC_YEAR_OPTIONS = ACADEMIC_YEARS.map((y) => ({ label: y, value: y }))

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [showBook, setShowBook] = useState(false)
  const [semester, setSemester] = useState<string>(SEMESTERS[0])
  const [academicYear, setAcademicYear] = useState<string>(defaultAcademicYear())
  const [message, setMessage] = useState('')
  const queryClient = useQueryClient()

  const { data: listing, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => getListing(id!),
    enabled: !!id,
    retry: false,
  })

  const { data: savedListings, refetch: refetchSaved, isRefetching: isRefetchingSaved } = useQuery({
    queryKey: ['saved'],
    queryFn: getSavedListings,
  })

  const isRefreshing = isRefetching || isRefetchingSaved

  async function handleRefresh() {
    await Promise.all([refetch(), refetchSaved()])
  }

  const isSaved = savedListings?.some((l) => l.id === id) ?? false

  const bookMutation = useMutation({
    mutationFn: () =>
      createBooking({
        listing_id: id!,
        semester,
        academic_year: academicYear,
        message: message || undefined,
      }),
    onSuccess: () => {
      setShowBook(false)
      Alert.alert('Request sent', 'The host will respond to your booking request.')
    },
    onError: (e: Error) => Alert.alert('Error', e.message),
  })

  const chatMutation = useMutation({
    mutationFn: () => createConversation(id!),
    onSuccess: (conv) => router.push(`/(student)/chats/${conv.id}`),
    onError: (e: Error) => Alert.alert('Error', e.message),
  })

  const saveMutation = useMutation({
    mutationFn: () => toggleSavedListing(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved'] })
    },
    onError: (e: Error) => Alert.alert('Error', e.message),
  })

  useEffect(() => {
    if (listing) addRecentlyViewed(listing)
  }, [listing?.id])

  if (isLoading) return <LoadingSpinner />

  if (isError || !listing) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Listing" />
        <ErrorState message="This listing could not be found." onRetry={() => refetch()} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={listing.title} />
      <ScrollView
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
      >
        <ListingImageGallery images={listing.images || []} />
        <View style={styles.content}>
          <Text style={styles.price}>{formatPrice(listing.price_per_semester)}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <Text style={styles.title}>{listing.title}</Text>
          <View style={styles.locationRow}>
            <HugeiconsIcon icon={Location01Icon} size={16} color={Colors.textSecondary} />
            <Text style={styles.location}>{listing.address}</Text>
          </View>
          </View>
          <AmenitiesRow listing={listing} />
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{listing.description}</Text>
        </View>
      </ScrollView>
      <ListingDetailActions
        priceLabel={formatPrice(listing.price_per_semester).replace('/sem', '')}
        isSaved={isSaved}
        onSave={() => saveMutation.mutate()}
        onChat={() => chatMutation.mutate()}
        onBook={() => setShowBook(true)}
        saveLoading={saveMutation.isPending}
        chatLoading={chatMutation.isPending}
      />

      <Modal visible={showBook} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Book a viewing</Text>
            <SelectField label="Semester" value={semester} options={SEMESTER_OPTIONS} onChange={setSemester} />
            <SelectField
              label="Academic year"
              value={academicYear}
              options={ACADEMIC_YEAR_OPTIONS}
              onChange={setAcademicYear}
            />
            <Input label="Message (optional)" value={message} onChangeText={setMessage} />
            <Button
              title="Send request"
              onPress={() => bookMutation.mutate()}
              loading={bookMutation.isPending}
              loadingTitle="Sending…"
            />
            <Button title="Cancel" variant="outline" onPress={() => setShowBook(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.sm },
  content: { padding: Spacing.md },
  price: { fontSize: 20, fontWeight: '700', color: Colors.primary },
  title: { fontSize: 20, fontWeight: '600', color: Colors.text, marginTop: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginTop: 8 },
  location: { flex: 1, fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: Colors.text, marginTop: 20, marginBottom: 8 },
  description: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: {
    backgroundColor: Colors.surface,
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    gap: 8,
  },
  modalTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8, color: Colors.text },
})
