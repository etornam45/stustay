import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$lib/db'
import { messages, conversations } from '$lib/db/schema'
import { randomId } from '$lib/utils/randomId'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

export const GET: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) return json({ error: 'Not authenticated' }, { status: 401 })

  const conv = await db.select().from(conversations).where(eq(conversations.id, params.conversationId)).limit(1)
  if (!conv[0]) return json({ error: 'Conversation not found' }, { status: 404 })
  if (conv[0].student_id !== locals.user.id && conv[0].homeowner_id !== locals.user.id) {
    return json({ error: 'Forbidden' }, { status: 403 })
  }

  const msgs = await db.select()
    .from(messages)
    .where(eq(messages.conversation_id, params.conversationId))
    .orderBy(messages.sent_at)

  return json(msgs)
}

const sendSchema = z.object({ body: z.string().min(1) })

export const POST: RequestHandler = async ({ params, request, locals }) => {
  if (!locals.user) return json({ error: 'Not authenticated' }, { status: 401 })

  const body = await request.json()
  const parsed = sendSchema.safeParse(body)
  if (!parsed.success) {
    return json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const conv = await db.select().from(conversations).where(eq(conversations.id, params.conversationId)).limit(1)
  if (!conv[0]) return json({ error: 'Conversation not found' }, { status: 404 })
  if (conv[0].student_id !== locals.user.id && conv[0].homeowner_id !== locals.user.id) {
    return json({ error: 'Forbidden' }, { status: 403 })
  }

  const msg = await db.insert(messages).values({
    id: randomId(),
    conversation_id: params.conversationId,
    sender_id: locals.user.id,
    body: parsed.data.body,
  }).returning()

  return json(msg[0], { status: 201 })
}
