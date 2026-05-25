import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Alert, ScrollView, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import * as ImagePicker from 'expo-image-picker'
import { useAuthStore } from '@/lib/store/authStore'
import { signOut, removeAccount } from '@/lib/auth/signOut'
import { AccountSwitcher } from '@/components/profile/AccountSwitcher'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Colors } from '@/constants/colors'
import { FontSize, Spacing } from '@/constants/theme'
import { getMe, updateMe } from '@/lib/api/users'
import { uploadImageToCloudinary } from '@/lib/utils/cloudinary'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ErrorState } from '@/components/common/ErrorState'

export default function HomeownerProfileScreen() {
  const user = useAuthStore((s) => s.user)
  const [uploading, setUploading] = useState(false)
  const [bio, setBio] = useState('')
  const [address, setAddress] = useState('')
  const [saving, setSaving] = useState(false)

  const { data: profile, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  })

  useEffect(() => {
    if (profile?.homeowner_profile) {
      setBio(profile.homeowner_profile.bio || '')
      setAddress(profile.homeowner_profile.address || '')
    }
  }, [profile])

  async function saveProfile() {
    setSaving(true)
    try {
      await updateMe({ bio, address })
      await refetch()
      Alert.alert('Saved', 'Profile updated')
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function uploadNationalId() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow photo access to upload your ID')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 })
    if (result.canceled || !result.assets[0]) return

    setUploading(true)
    try {
      const url = await uploadImageToCloudinary(result.assets[0].uri)
      await updateMe({ national_id_url: url })
      await refetch()
      Alert.alert('Uploaded', 'National ID submitted')
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  function handleRemoveAccount(userId: string) {
    Alert.alert('Remove account', 'This removes the account from this device.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeAccount(userId) },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        <Text style={styles.title}>Profile</Text>
        <Card>
          <Text style={styles.name}>{profile?.full_name || user?.full_name}</Text>
          <Text style={styles.email}>{profile?.email || user?.email}</Text>
          <Text style={styles.role}>
            Homeowner · {profile?.is_verified ? '✓ Verified' : 'Unverified'}
          </Text>
        </Card>
        <AccountSwitcher onRemoveAccount={handleRemoveAccount} />
        <View style={styles.form}>
          <Input label="Address" value={address} onChangeText={setAddress} />
          <Input label="Bio" value={bio} onChangeText={setBio} />
          <Button
            title="Save profile"
            onPress={saveProfile}
            loading={saving}
            loadingTitle="Saving…"
          />
          <Button
            title="Upload National ID"
            variant="outline"
            onPress={uploadNationalId}
            loading={uploading}
            loadingTitle="Uploading…"
          />
          <Button title="Sign out of this account" onPress={() => signOut()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.md, paddingBottom: 32 },
  title: { fontSize: FontSize.screenTitle, fontWeight: '700', color: Colors.text, marginBottom: Spacing.lg },
  name: { fontSize: 22, fontWeight: '600', color: Colors.text },
  email: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  role: { fontSize: 14, color: Colors.primary, marginTop: 4, fontWeight: '500' },
  form: { marginTop: Spacing.lg, gap: Spacing.md },
})
