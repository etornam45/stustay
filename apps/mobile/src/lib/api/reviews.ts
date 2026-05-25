import { apiPost } from './client'

export function createReview(data: {
  booking_id: string
  reviewee_id: string
  listing_id: string
  rating: number
  comment?: string
}) {
  return apiPost<{ id: string }>('/reviews', data)
}
