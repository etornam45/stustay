import { create } from 'zustand'

interface FilterState {
  minPrice: number | null
  maxPrice: number | null
  bedrooms: number | null
  isFurnished: boolean | null
  hasWifi: boolean | null
  hasSecurity: boolean | null
  hasBackupPower: boolean | null
  hasWater: boolean | null
  nearCampus: boolean
  latitude: number | null
  longitude: number | null
  radiusKm: number | null
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  resetFilters: () => void
  setNearCampus: (lat: number, lng: number, radiusKm?: number) => void
}

const initialState = {
  minPrice: null,
  maxPrice: null,
  bedrooms: null,
  isFurnished: null,
  hasWifi: null,
  hasSecurity: null,
  hasBackupPower: null,
  hasWater: null,
  nearCampus: false,
  latitude: null,
  longitude: null,
  radiusKm: null,
}

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,
  setFilter: (key, value) => set({ [key]: value }),
  resetFilters: () => set(initialState),
  setNearCampus: (lat, lng, radiusKm = 5) =>
    set({
      ...initialState,
      nearCampus: true,
      latitude: lat,
      longitude: lng,
      radiusKm,
    }),
}))
