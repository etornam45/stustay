import { useState } from 'react'
import { View, Text, StyleSheet, Alert, ScrollView, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import * as ImagePicker from 'expo-image-picker'
import { useAuthStore } from '@/lib/store/authStore'
import { signOut, removeAccount } from '@/lib/auth/signOut'
import { AccountSwitcher } from '@/components/profile/AccountSwitcher'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Colors } from '@/constants/colors'
import { FontSize, Spacing } from '@/constants/theme'
import { getMe, updateMe } from '@/lib/api/users'
import { uploadImageToCloudinary } from '@/lib/utils/cloudinary'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ErrorState } from '@/components/common/ErrorState'

export default function StudentProfileScreen() {
  const user = useAuthStore((s) => s.user)
  const [uploading, setUploading] = useState(false)

  const { data: profile, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  })

  async function uploadStudentId() {
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
      await updateMe({ student_id_url: url })
      await refetch()
      Alert.alert('Uploaded', 'Student ID uploaded')
    } catch (e: unknown) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorState onRetry={() => refetch()} />

  const display = profile || user

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
          <Text style={styles.name}>{display?.full_name}</Text>
          <Text style={styles.email}>{display?.email}</Text>
          <Text style={styles.role}>Student</Text>
          {profile?.student_profile?.university && (
            <Text style={styles.meta}>{profile.student_profile.university}</Text>
          )}
          {profile?.student_profile?.program && (
            <Text style={styles.meta}>{profile.student_profile.program}</Text>
          )}
        </Card>
        <AccountSwitcher onRemoveAccount={handleRemoveAccount} />
        <View style={styles.actions}>
          <Button title="My Bookings" variant="outline" onPress={() => router.push('/(student)/profile/bookings')} />
          <Button
            title="Upload Student ID"
            variant="outline"
            onPress={uploadStudentId}
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
  meta: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  actions: { marginTop: Spacing.lg, gap: Spacing.md },
})
