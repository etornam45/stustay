import { useState } from 'react'
import { View, Text, ScrollView, TextInput, Switch, StyleSheet, Image, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ScreenHeader } from '@/components/common/ScreenHeader'
import { createListing } from '@/lib/api/listings'
import { uploadImageToCloudinary } from '@/lib/utils/cloudinary'
import { Colors } from '@/constants/colors'

function validateStep(
  step: number,
  fields: { title: string; description: string; address: string; price: string; imageUris: string[] }
): string | null {
  if (step === 1) {
    if (!fields.title.trim()) return 'Title is required'
    if (!fields.address.trim()) return 'Address is required'
  }
  if (step === 2) {
    const p = parseInt(fields.price)
    if (!fields.price || isNaN(p) || p <= 0) return 'Enter a valid price'
  }
  if (step === 4 && fields.imageUris.length === 0) return 'Add at least one photo'
  return null
}

export default function NewListingScreen() {
  const [step, setStep] = useState(1)
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
  const [imageUris, setImageUris] = useState<string[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fields = { title, description, address, price, imageUris }

  function goNext(nextStep: number) {
    const err = validateStep(step, fields)
    if (err) {
      Alert.alert('Missing information', err)
      return
    }
    setError('')
    setStep(nextStep)
  }

  async function pickImages() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow photo access to add listing images')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 7 - imageUris.length,
      quality: 0.8,
    })
    if (!result.canceled) {
      setImageUris((prev) => [...prev, ...result.assets.map((a) => a.uri)].slice(0, 7))
    }
  }

  async function handleSubmit() {
    const err = validateStep(4, fields)
    if (err) {
      Alert.alert('Missing information', err)
      return
    }
    setError('')
    setLoading(true)
    try {
      const uploaded: string[] = []
      for (const uri of imageUris) {
        uploaded.push(await uploadImageToCloudinary(uri))
      }
      await createListing({
        title,
        description,
        address,
        price_per_semester: parseInt(price),
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        is_furnished: isFurnished,
        has_wifi: hasWifi,
        has_security: hasSecurity,
        has_backup_power: hasBackupPower,
        has_water: hasWater,
        images: uploaded,
      })
      router.back()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="New Listing"
        rightAction={<Text style={styles.step}>Step {step}/5</Text>}
      />

      <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
        {step === 1 && (
          <>
            <Input label="Title" value={title} onChangeText={setTitle} placeholder="e.g. Cozy room near UCC" />
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your property..."
              multiline
              numberOfLines={4}
            />
            <Input label="Address" value={address} onChangeText={setAddress} placeholder="Street, area, landmark" />
            <Button title="Next" onPress={() => goNext(2)} />
          </>
        )}
        {step === 2 && (
          <>
            <Input label="Price per Semester (Ghc)" value={price} onChangeText={setPrice} keyboardType="phone-pad" />
            <Input label="Bedrooms" value={bedrooms} onChangeText={setBedrooms} keyboardType="phone-pad" />
            <Input label="Bathrooms" value={bathrooms} onChangeText={setBathrooms} keyboardType="phone-pad" />
            <View style={styles.actions}>
              <Button title="Previous" variant="outline" onPress={() => setStep(1)} />
              <Button title="Next" onPress={() => goNext(3)} />
            </View>
          </>
        )}
        {step === 3 && (
          <>
            <Text style={styles.label}>Amenities</Text>
            {[
              ['Furnished', isFurnished, setIsFurnished],
              ['WiFi', hasWifi, setHasWifi],
              ['Security', hasSecurity, setHasSecurity],
              ['Backup Power', hasBackupPower, setHasBackupPower],
              ['Water', hasWater, setHasWater],
            ].map(([label, val, set]) => (
              <View key={label as string} style={styles.switchRow}>
                <Text>{label as string}</Text>
                <Switch value={val as boolean} onValueChange={set as (v: boolean) => void} />
              </View>
            ))}
            <View style={styles.actions}>
              <Button title="Previous" variant="outline" onPress={() => setStep(2)} />
              <Button title="Next" onPress={() => goNext(4)} />
            </View>
          </>
        )}
        {step === 4 && (
          <>
            <Text style={styles.label}>Photos (up to 7)</Text>
            <ScrollView horizontal style={styles.photoRow}>
              {imageUris.map((uri) => (
                <Image key={uri} source={{ uri }} style={styles.thumb} />
              ))}
            </ScrollView>
            <Button title="Add photos" variant="outline" onPress={pickImages} />
            <View style={styles.actions}>
              <Button title="Previous" variant="outline" onPress={() => setStep(3)} />
              <Button title="Next" onPress={() => goNext(5)} />
            </View>
          </>
        )}
        {step === 5 && (
          <>
            <Text style={styles.label}>Review</Text>
            <Text style={styles.review}>{title}</Text>
            <Text style={styles.review}>{address}</Text>
            <Text style={styles.review}>
              Ghc {price}/sem · {bedrooms} bed
            </Text>
            <Text style={styles.review}>{imageUris.length} photo(s)</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.actions}>
              <Button title="Previous" variant="outline" onPress={() => setStep(4)} />
              <Button
                title="Publish listing"
                onPress={handleSubmit}
                loading={loading}
                loadingTitle="Publishing…"
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  step: { fontSize: 14, color: Colors.textSecondary },
  form: { flex: 1 },
  formContent: { padding: 16, paddingBottom: 32 },
  label: { fontSize: 14, fontWeight: '500', color: Colors.text, marginBottom: 6 },
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  error: { color: Colors.error, fontSize: 14, marginTop: 12, textAlign: 'center' },
  photoRow: { marginBottom: 12 },
  thumb: { width: 80, height: 80, borderRadius: 8, marginRight: 8 },
  review: { fontSize: 15, color: Colors.text, marginBottom: 6 },
})
