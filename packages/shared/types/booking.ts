export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed'

export interface Booking {
  id: string
  listing_id: string
  student_id: string
  homeowner_id: string
  semester: string
  academic_year: string
  status: BookingStatus
  message: string | null
  completed_at: string | null
  created_at: string
}
