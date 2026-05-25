export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'taken'

export interface Listing {
  id: string
  homeowner_id: string
  title: string
  description: string
  address: string
  latitude: number | null
  longitude: number | null
  price_per_semester: number
  bedrooms: number
  bathrooms: number
  is_furnished: boolean
  has_wifi: boolean
  has_security: boolean
  has_backup_power: boolean
  has_water: boolean
  status: ListingStatus
  created_at: string
  images?: ListingImage[]
}

export interface ListingImage {
  id: string
  listing_id: string
  url: string
  is_primary: boolean
}

export interface ListingSearchParams {
  query?: string
  min_price?: number
  max_price?: number
  bedrooms?: number
  is_furnished?: boolean
  has_wifi?: boolean
  has_security?: boolean
  has_backup_power?: boolean
  has_water?: boolean
  latitude?: number
  longitude?: number
  radius_km?: number
  mine?: boolean
}
