import { pgTable, text, timestamp, boolean, integer, doublePrecision, foreignKey } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  role: text('role', { enum: ['student', 'homeowner', 'admin'] }).notNull(),
  full_name: text('full_name').notNull(),
  phone: text('phone'),
  avatar_url: text('avatar_url'),
  is_verified: boolean('is_verified').notNull().default(false),
  is_banned: boolean('is_banned').notNull().default(false),
  verification_code: text('verification_code'),
  verification_expires: timestamp('verification_expires'),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

export const studentProfiles = pgTable('student_profiles', {
  user_id: text('user_id').primaryKey().references(() => users.id),
  university: text('university').notNull(),
  student_id_url: text('student_id_url'),
  program: text('program'),
  year_of_study: integer('year_of_study'),
})

export const homeownerProfiles = pgTable('homeowner_profiles', {
  user_id: text('user_id').primaryKey().references(() => users.id),
  national_id_url: text('national_id_url'),
  address: text('address'),
  bio: text('bio'),
})

export const listings = pgTable('listings', {
  id: text('id').primaryKey(),
  homeowner_id: text('homeowner_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  address: text('address').notNull(),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  price_per_semester: integer('price_per_semester').notNull(),
  bedrooms: integer('bedrooms').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  is_furnished: boolean('is_furnished').notNull().default(false),
  has_wifi: boolean('has_wifi').notNull().default(false),
  has_security: boolean('has_security').notNull().default(false),
  has_backup_power: boolean('has_backup_power').notNull().default(false),
  has_water: boolean('has_water').notNull().default(false),
  status: text('status', { enum: ['pending', 'approved', 'rejected', 'taken'] }).notNull().default('approved'),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

export const listingImages = pgTable('listing_images', {
  id: text('id').primaryKey(),
  listing_id: text('listing_id').notNull().references(() => listings.id),
  url: text('url').notNull(),
  is_primary: boolean('is_primary').notNull().default(false),
})

export const savedListings = pgTable('saved_listings', {
  user_id: text('user_id').notNull().references(() => users.id),
  listing_id: text('listing_id').notNull().references(() => listings.id),
  saved_at: timestamp('saved_at').notNull().defaultNow(),
})

export const bookings = pgTable('bookings', {
  id: text('id').primaryKey(),
  listing_id: text('listing_id').notNull().references(() => listings.id),
  student_id: text('student_id').notNull().references(() => users.id),
  homeowner_id: text('homeowner_id').notNull().references(() => users.id),
  semester: text('semester').notNull(),
  academic_year: text('academic_year').notNull(),
  status: text('status', { enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'] }).notNull().default('pending'),
  message: text('message'),
  completed_at: timestamp('completed_at'),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

export const conversations = pgTable('conversations', {
  id: text('id').primaryKey(),
  listing_id: text('listing_id').references(() => listings.id),
  booking_id: text('booking_id').references(() => bookings.id),
  student_id: text('student_id').notNull().references(() => users.id),
  homeowner_id: text('homeowner_id').notNull().references(() => users.id),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  conversation_id: text('conversation_id').notNull().references(() => conversations.id),
  sender_id: text('sender_id').notNull().references(() => users.id),
  body: text('body').notNull(),
  sent_at: timestamp('sent_at').notNull().defaultNow(),
  is_read: boolean('is_read').notNull().default(false),
})

export const reviews = pgTable('reviews', {
  id: text('id').primaryKey(),
  booking_id: text('booking_id').notNull().references(() => bookings.id),
  reviewer_id: text('reviewer_id').notNull().references(() => users.id),
  reviewee_id: text('reviewee_id').notNull().references(() => users.id),
  listing_id: text('listing_id').notNull().references(() => listings.id),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

