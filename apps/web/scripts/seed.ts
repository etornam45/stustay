import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { randomBytes, scryptSync } from 'crypto'
import { eq } from 'drizzle-orm'
import {
  users,
  studentProfiles,
  homeownerProfiles,
  listings,
  listingImages,
} from '../src/lib/db/schema'

const connectionString = process.env.DB_URL!
const client = postgres(connectionString)
const db = drizzle(client)

function hashPassword(password: string): string {
  const salt = randomBytes(32).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

const SEED_EMAILS = [
  'student1@test.com',
  'student2@test.com',
  'student3@test.com',
  'homeowner1@test.com',
  'homeowner2@test.com',
  'admin@stustay.com',
]

async function main() {
  const existing = await db.select({ email: users.email }).from(users)
  const existingEmails = new Set(existing.map((u) => u.email))

  if (SEED_EMAILS.every((e) => existingEmails.has(e))) {
    console.log('Seed data already present — skipping insert.')
    await client.end()
    return
  }

  const students = [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()]
  const homeowners = [crypto.randomUUID(), crypto.randomUUID()]
  const adminId = crypto.randomUUID()

  const toInsert = [
    ...students.map((sid, i) => ({
      id: sid,
      email: `student${i + 1}@test.com`,
      password_hash: hashPassword('password123'),
      role: 'student' as const,
      full_name: `Test Student ${i + 1}`,
      phone: `+23320000000${i}`,
      is_verified: true,
      is_banned: false,
    })),
    ...homeowners.map((hid, i) => ({
      id: hid,
      email: `homeowner${i + 1}@test.com`,
      password_hash: hashPassword('password123'),
      role: 'homeowner' as const,
      full_name: `Test Homeowner ${i + 1}`,
      phone: `+23330000000${i}`,
      is_verified: true,
      is_banned: false,
    })),
    {
      id: adminId,
      email: 'admin@stustay.com',
      password_hash: hashPassword('admin123'),
      role: 'admin' as const,
      full_name: 'Admin User',
      phone: '+23340000000',
      is_verified: true,
      is_banned: false,
    },
  ].filter((u) => !existingEmails.has(u.email))

  if (toInsert.length > 0) {
    await db.insert(users).values(toInsert)
  }

  const studentIds = students.filter((_, i) => !existingEmails.has(`student${i + 1}@test.com`))
  if (studentIds.length > 0) {
    await db.insert(studentProfiles).values(
      studentIds.map((sid, i) => ({
        user_id: sid,
        university: 'University of Cape Coast',
        program: 'Computer Science',
        year_of_study: 2,
      }))
    )
  }

  const homeownerIds = homeowners.filter((_, i) => !existingEmails.has(`homeowner${i + 1}@test.com`))
  if (homeownerIds.length > 0) {
    await db.insert(homeownerProfiles).values(
      homeownerIds.map((hid) => ({
        user_id: hid,
        address: 'Cape Coast',
        bio: 'Trusted local host',
      }))
    )
  }

  const listingCount = await db.select().from(listings)
  if (listingCount.length === 0) {
    const allHomeowners = await db
      .select()
      .from(users)
      .where(eq(users.role, 'homeowner'))

    const listingData = [
      {
        title: 'Cozy 1BR Near UCC Main Gate',
        description: 'Walking distance to campus. Quiet neighborhood with security.',
        address: 'Science Junction, Cape Coast',
        price: 1200,
        bedrooms: 1,
        lat: 5.1053,
        lng: -1.2466,
      },
      {
        title: 'Spacious 2BR with WiFi',
        description: 'Fully furnished. Backup power and water tank included.',
        address: 'Amamoma, Cape Coast',
        price: 1800,
        bedrooms: 2,
        lat: 5.112,
        lng: -1.28,
      },
      {
        title: 'Affordable Shared Room',
        description: 'Perfect for budget-conscious students. Shared kitchen.',
        address: 'Kwaprow, Cape Coast',
        price: 800,
        bedrooms: 1,
        lat: 5.098,
        lng: -1.255,
      },
      {
        title: 'Modern Studio Apartment',
        description: 'Private bathroom, study desk, high-speed WiFi.',
        address: 'University Junction, Cape Coast',
        price: 1500,
        bedrooms: 1,
        lat: 5.108,
        lng: -1.27,
      },
      {
        title: 'Family-Style 3BR House',
        description: 'Large compound, parking, 24/7 security guard.',
        address: 'Pedu, Cape Coast',
        price: 2500,
        bedrooms: 3,
        lat: 5.115,
        lng: -1.24,
      },
    ]

    for (let i = 0; i < listingData.length; i++) {
      const data = listingData[i]
      const listingId = crypto.randomUUID()
      const homeownerId = allHomeowners[i % allHomeowners.length]?.id ?? homeowners[0]

      await db.insert(listings).values({
        id: listingId,
        homeowner_id: homeownerId,
        title: data.title,
        description: data.description,
        address: data.address,
        latitude: data.lat,
        longitude: data.lng,
        price_per_semester: data.price,
        bedrooms: data.bedrooms,
        bathrooms: 1,
        is_furnished: true,
        has_wifi: true,
        has_security: i % 2 === 0,
        has_backup_power: i > 1,
        has_water: true,
        status: 'approved',
      })

      await db.insert(listingImages).values({
        id: crypto.randomUUID(),
        listing_id: listingId,
        url: `https://picsum.photos/seed/stustay${i}/800/600`,
        is_primary: true,
      })
    }
  }

  console.log('Seed complete!')
  console.log('  Students:   student1@test.com … student3@test.com / password123')
  console.log('  Homeowners: homeowner1@test.com, homeowner2@test.com / password123')
  console.log('  Admin:      admin@stustay.com / admin123')

  await client.end()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
