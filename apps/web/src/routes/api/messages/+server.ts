import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import {
  conversations,
  messages,
  users,
  listings,
  listingImages,
} from '$lib/db/schema'
import { eq, or, desc } from 'drizzle-orm'

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) return json({ error: 'Not authenticated' }, { status: 401 })

  const convs = await db
    .select()
    .from(conversations)
    .where(
      or(
        eq(conversations.student_id, locals.user.id),
        eq(conversations.homeowner_id, locals.user.id)
      )
    )
    .orderBy(desc(conversations.created_at))

  const enriched = await Promise.all(
    convs.map(async (conv) => {
      const otherUserId =
        locals.user!.id === conv.student_id ? conv.homeowner_id : conv.student_id

      const [otherUser] = await db
        .select({ full_name: users.full_name, avatar_url: users.avatar_url })
        .from(users)
        .where(eq(users.id, otherUserId))
        .limit(1)

      const [lastMsg] = await db
        .select()
        .from(messages)
        .where(eq(messages.conversation_id, conv.id))
        .orderBy(desc(messages.sent_at))
        .limit(1)

      let listing_title: string | null = null
      let listing_image_url: string | null = null

      if (conv.listing_id) {
        const [listing] = await db
          .select({ title: listings.title })
          .from(listings)
          .where(eq(listings.id, conv.listing_id))
          .limit(1)
        listing_title = listing?.title ?? null

        const [img] = await db
          .select({ url: listingImages.url })
          .from(listingImages)
          .where(eq(listingImages.listing_id, conv.listing_id))
          .orderBy(desc(listingImages.is_primary))
          .limit(1)
        listing_image_url = img?.url ?? null
      }

      return {
        ...conv,
        created_at: conv.created_at.toISOString(),
        other_user_name: otherUser?.full_name ?? 'User',
        other_user_avatar: otherUser?.avatar_url ?? null,
        listing_title,
        listing_image_url,
        last_message: lastMsg
          ? {
              ...lastMsg,
              sent_at: lastMsg.sent_at.toISOString(),
            }
          : null,
      }
    })
  )

  return json(enriched)
}
