import { apiGet, apiPost } from './client'
import type { Conversation, Message } from '@stustay/shared'

export function getConversations() {
  return apiGet<Conversation[]>('/messages')
}

export function createConversation(listingId: string) {
  return apiPost<Conversation>('/conversations', { listing_id: listingId })
}

export function getMessages(conversationId: string) {
  return apiGet<Message[]>(`/messages/${conversationId}`)
}

export function sendMessage(conversationId: string, body: string) {
  return apiPost<Message>(`/messages/${conversationId}`, { body })
}
