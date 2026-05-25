import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js'
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite'
import { PGlite } from '@electric-sql/pglite'
import postgres from 'postgres'
import * as schema from './schema'
import { env } from '$env/dynamic/private'

const dbUrl = env.DB_URL || 'pglite'

function usePglite(url: string) {
  return url === 'pglite' || url.startsWith('file:')
}

function createDb() {
  if (usePglite(dbUrl)) {
    const path = dbUrl === 'pglite' ? '.data/stustay' : dbUrl.replace(/^file:/, '')
    const client = new PGlite(path)
    return drizzlePglite(client, { schema })
  }

  const client = postgres(dbUrl)
  return drizzlePostgres(client, { schema })
}

export const db = createDb()
