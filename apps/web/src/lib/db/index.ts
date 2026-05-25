import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { env } from '$env/dynamic/private'

function createDb() {
  const dbUrl = env.DB_URL
  if (!dbUrl) {
    throw new Error('DB_URL environment variable is required')
  }

  const client = postgres(dbUrl)
  return drizzle(client, { schema })
}

export const db = createDb()
