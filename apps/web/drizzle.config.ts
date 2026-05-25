import { defineConfig } from 'drizzle-kit'

const dbUrl = process.env.DB_URL || 'pglite'
const isPglite = dbUrl === 'pglite' || dbUrl.startsWith('file:')

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dialect: 'postgresql',
  ...(isPglite
    ? {
        driver: 'pglite',
        dbCredentials: {
          url: dbUrl === 'pglite' ? '.data/stustay' : dbUrl.replace(/^file:/, ''),
        },
      }
    : {
        dbCredentials: {
          url: dbUrl,
        },
      }),
})
