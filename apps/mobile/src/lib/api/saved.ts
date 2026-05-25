import { apiGet, apiPost, apiDelete } from './client'
import type { Listing } from '@stustay/shared'

export function getSavedListings() {
  return apiGet<Listing[]>('/saved')
}

export function toggleSavedListing(listingId: string) {
  return apiPost<{ saved: boolean }>('/saved', { listing_id: listingId })
}

export function unsaveListing(listingId: string) {
  return apiDelete<{ message: string }>(`/saved?listing_id=${listingId}`)
}
