import { apiGet, apiPost, apiPatch, apiPut, apiDelete } from './client'
import type { Listing, ListingSearchParams } from '@stustay/shared'

export function searchListings(params: ListingSearchParams = {}) {
  const query = new URLSearchParams()
  if (params.query) query.set('query', params.query)
  if (params.min_price) query.set('min_price', String(params.min_price))
  if (params.max_price) query.set('max_price', String(params.max_price))
  if (params.bedrooms) query.set('bedrooms', String(params.bedrooms))
  if (params.is_furnished) query.set('is_furnished', 'true')
  if (params.has_wifi) query.set('has_wifi', 'true')
  if (params.has_security) query.set('has_security', 'true')
  if (params.has_backup_power) query.set('has_backup_power', 'true')
  if (params.has_water) query.set('has_water', 'true')
  if (params.latitude) query.set('latitude', String(params.latitude))
  if (params.longitude) query.set('longitude', String(params.longitude))
  if (params.radius_km) query.set('radius_km', String(params.radius_km))
  if (params.mine) query.set('mine', 'true')

  const qs = query.toString()
  return apiGet<Listing[]>(`/listings${qs ? `?${qs}` : ''}`)
}

export function getListing(id: string) {
  return apiGet<Listing>(`/listings/${id}`)
}

export function createListing(data: Omit<Partial<Listing>, 'images'> & { images?: string[] }) {
  return apiPost<{ id: string }>('/listings', data)
}

export function updateListing(id: string, data: Partial<Listing>) {
  return apiPatch<{ message: string }>(`/listings/${id}`, data)
}

export function deleteListing(id: string) {
  return apiDelete<{ message: string }>(`/listings/${id}`)
}

export function uploadListingImages(listingId: string, urls: string[]) {
  return apiPost<{ message: string }>(`/listings/${listingId}/images`, { urls })
}

export function replaceListingImages(
  listingId: string,
  images: { url: string; is_primary: boolean }[]
) {
  return apiPut<{ message: string }>(`/listings/${listingId}/images`, { images })
}
