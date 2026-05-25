export interface Conversation {
  id: string
  listing_id: string | null
  booking_id: string | null
  student_id: string
  homeowner_id: string
  created_at: string
  other_user_name?: string
  other_user_avatar?: string | null
  listing_title?: string | null
  listing_image_url?: string | null
  last_message?: Message | null
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  body: string
  sent_at: string
  is_read: boolean
}
