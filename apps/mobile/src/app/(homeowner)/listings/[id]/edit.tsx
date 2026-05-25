import { useState, useEffect } from 'react'
import {
  ScrollView,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  Image,
  View,
  Alert,
  Pressable,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { getListing, updateListing, replaceListingImages } from '@/lib/api/listings'
import { uploadImageToCloudinary } from '@/lib/utils/cloudinary'
import { Colors } from '@/constants/colors'

interface EditableImage {
  key: string
  url: string
  isPrimary: boolean
  isLocal: boolean
}

function toEditableImages(
  images: { id: string; url: string; is_primary: boolean }[]
): EditableImage[] {
  return images.map((img) => ({
    key: img.id,
    url: img.url,
    isPrimary: img.is_primary,
    isLocal: false,
  }))
}

export default function EditListingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { data: listing, isLoading, isError, refetch } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => getListing(id!),
    enabled: !!id,
    retry: false,
  })

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [price, setPrice] = useState('')
  const [bedrooms, setBedrooms] = useState('1')
  const [bathrooms, setBathrooms] = useState('1')
  const [isFurnished, setIsFurnished] = useState(false)
  const [hasWifi, setHasWifi] = useState(false)
  const [hasSecurity, setHasSecurity] = useState(false)
  const [hasBackupPower, setHasBackupPower] = useState(false)
  const [hasWater, setHasWater] = useState(false)
  const [images, setImages] = useState<EditableImage[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (listing) {
      setTitle(listing.title)
      setDescription(listing.description)
      setAddress(listing.address)
      setPrice(String(listing.price_per_semester))
      setBedrooms(String(listing.bedrooms))
      setBathrooms(String(listing.bathrooms))
      setIsFurnished(listing.is_furnished)
      setHasWifi(listing.has_wifi)
      setHasSecurity(listing.has_security)
      setHasBackupPower(listing.has_backup_power)
      setHasWater(listing.has_water)
      setImages(toEditableImages(listing.images || []))
    }
  }, [listing])

  function removeImage(key: string) {
    setImages((prev) => {
      const next = prev.filter((img) => img.key !== key)
      if (next.length && !next.some((img) => img.isPrimary)) {
        next[0].isPrimary = true
      }
      return [...next]
    })
  }

  function setPrimary(key: string) {
    setImages((prev) =>
      prev.map((img) => ({ ...img, isPrimary: img.key === key }))
    )
  }

  async function pickImages() {
    if (images.length >= 7) {
      Alert.alert('Limit reached', 'Maximum 7 photos per listing')
      return
    }
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow photo access to add images')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 7 - images.length,
      quality: 0.8,
    })
    if (!result.canceled) {
      const added = result.assets.map((asset, i) => ({
        key: `local-${Date.now()}-${i}`,
        url: asset.uri,
        isPrimary: images.length === 0 && i === 0,
        isLocal: true,
      }))
      setImages((prev) => {
        const next = [...prev, ...added].slice(0, 7)
        if (!next.some((img) => img.isPrimary) && next.length) {
          next[0].isPrimary = true
        }
        return next
      })
    }
  }

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert('Validation', 'Title is required')
      return
    }
    const p = parseInt(price)
    if (!price || isNaN(p) || p <= 0) {
      Alert.alert('Validation', 'Enter a valid price')
      return
    }
    if (images.length === 0) {
      Alert.alert('Validation', 'Add at least one photo')
      return
    }

    setLoading(true)
    try {
      await updateListing(id!, {
        title,
        description,
        address,
        price_per_semester: p,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        is_furnished: isFurnished,
        has_wifi: hasWifi,
        has_security: hasSecurity,
        has_backup_power: hasBackupPower,
        has_water: hasWater,
      })

      const resolved = await Promise.all(
        images.map(async (img) => ({
          url: img.isLocal ? await uploadImageToCloudinary(img.url) : img.url,
          is_primary: img.isPrimary,
        }))
      )

      if (!resolved.some((img) => img.is_primary)) {
        resolved[0].is_primary = true
      }

      await replaceListingImages(id!, resolved)
      queryClient.invalidateQueries({ queryKey: ['listing', id] })
      queryClient.invalidateQueries({ queryKey: ['listings'] })
      Alert.alert('Saved', 'Listing updated successfully')
      router.back()
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not save listing')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) return <LoadingSpinner />

  if (isError || !listing) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Edit Listing" />
        <ErrorState message="Could not load listing." onRetry={() => refetch()} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Edit Listing" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Input label="Title" value={title} onChangeText={setTitle} />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
        <Input label="Address" value={address} onChangeText={setAddress} />
        <Input label="Price (Ghc/sem)" value={price} onChangeText={setPrice} keyboardType="phone-pad" />
        <Input label="Bedrooms" value={bedrooms} onChangeText={setBedrooms} keyboardType="phone-pad" />
        <Input label="Bathrooms" value={bathrooms} onChangeText={setBathrooms} keyboardType="phone-pad" />

        <Text style={styles.label}>Amenities</Text>
        {[
          ['Furnished', isFurnished, setIsFurnished],
          ['WiFi', hasWifi, setHasWifi],
          ['Security', hasSecurity, setHasSecurity],
          ['Backup power', hasBackupPower, setHasBackupPower],
          ['Water', hasWater, setHasWater],
        ].map(([label, val, set]) => (
          <View key={label as string} style={styles.switchRow}>
            <Text>{label as string}</Text>
            <Switch value={val as boolean} onValueChange={set as (v: boolean) => void} />
          </View>
        ))}

        <Text style={styles.label}>Photos ({images.length}/7)</Text>
        <Text style={styles.hint}>Tap a photo to set as cover · × to remove</Text>
        <ScrollView horizontal style={styles.photoRow}>
          {images.map((img) => (
            <View key={img.key} style={styles.thumbWrap}>
              <Pressable onPress={() => setPrimary(img.key)}>
                <Image source={{ uri: img.url }} style={styles.thumb} />
                {img.isPrimary && (
                  <View style={styles.primaryBadge}>
                    <Text style={styles.primaryText}>Cover</Text>
                  </View>
                )}
              </Pressable>
              <Pressable style={styles.removeBtn} onPress={() => removeImage(img.key)}>
                <Text style={styles.removeText}>×</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
        <Button title="Add photos" variant="outline" onPress={pickImages} />

        <Button
          title="Save changes"
          onPress={handleSave}
          loading={loading}
          loadingTitle="Saving…"
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16, paddingBottom: 32 },
  label: { fontSize: 14, fontWeight: '500', color: Colors.text, marginBottom: 6, marginTop: 8 },
  hint: { fontSize: 12, color: Colors.textSecondary, marginBottom: 8 },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  photoRow: { marginBottom: 16 },
  thumbWrap: { position: 'relative', marginRight: 8 },
  thumb: { width: 88, height: 88, borderRadius: 8 },
  primaryBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    paddingVertical: 2,
  },
  primaryText: { color: '#fff', fontSize: 10, fontWeight: '600', textAlign: 'center' },
  removeBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: { color: '#fff', fontSize: 16, fontWeight: '700', lineHeight: 18 },
})
