import { apiGet, apiPost, apiPatch } from './client'
import type { Booking, BookingStatus } from '@stustay/shared'

export interface BookingWithListing extends Booking {
  listing_title?: string
}

export function listBookings(status?: BookingStatus) {
  const qs = status ? `?status=${status}` : ''
  return apiGet<BookingWithListing[]>(`/bookings${qs}`)
}

export function createBooking(data: {
  listing_id: string
  semester: string
  academic_year: string
  message?: string
}) {
  return apiPost<{ id: string }>('/bookings', data)
}

export function getBooking(id: string) {
  return apiGet<Booking>(`/bookings/${id}`)
}

export function updateBookingStatus(
  id: string,
  status: 'accepted' | 'rejected' | 'cancelled' | 'completed'
) {
  return apiPatch<{ message: string }>(`/bookings/${id}`, { status })
}
