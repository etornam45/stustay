import { useState } from 'react'
import { View, ScrollView, Dimensions, StyleSheet, Text } from 'react-native'
import { Image } from 'expo-image'
import type { ListingImage } from '@stustay/shared'
import { Colors } from '@/constants/colors'

const { width } = Dimensions.get('window')

interface ListingImageGalleryProps {
  images: ListingImage[]
}

export function ListingImageGallery({ images }: ListingImageGalleryProps) {
  const [index, setIndex] = useState(0)

  if (!images.length) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>No photos</Text>
      </View>
    )
  }

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width)
          setIndex(i)
        }}
      >
        {images.map((img) => (
          <Image key={img.id} source={{ uri: img.url }} style={styles.image} contentFit="cover" />
        ))}
      </ScrollView>
      <Text style={styles.counter}>{index + 1} / {images.length}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  image: { width, height: 250 },
  placeholder: { width, height: 250, backgroundColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: Colors.textSecondary },
  counter: { position: 'absolute', bottom: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, fontSize: 12, overflow: 'hidden' },
})
