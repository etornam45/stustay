import { defineConfig } from 'drizzle-kit'

const dbUrl = process.env.DB_URL
if (!dbUrl) {
  throw new Error('DB_URL is required for drizzle-kit (set in apps/web/.env)')
}

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl,
  },
})
