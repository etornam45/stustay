import AsyncStorage from '@react-native-async-storage/async-storage'
import type { Listing } from '@stustay/shared'

const KEY = 'recently_viewed'
const MAX = 20

export async function addRecentlyViewed(listing: Listing) {
  const raw = await AsyncStorage.getItem(KEY)
  const list: Listing[] = raw ? JSON.parse(raw) : []
  const filtered = list.filter((l) => l.id !== listing.id)
  filtered.unshift(listing)
  await AsyncStorage.setItem(KEY, JSON.stringify(filtered.slice(0, MAX)))
}

export async function getRecentlyViewed(): Promise<Listing[]> {
  const raw = await AsyncStorage.getItem(KEY)
  return raw ? JSON.parse(raw) : []
}
