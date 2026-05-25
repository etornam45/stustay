import { z } from 'zod'

export const emailSchema = z.string().email()
export const passwordSchema = z.string().min(6)

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  full_name: z.string().min(1),
  phone: z.string().optional(),
  role: z.enum(['student', 'homeowner']),
  university: z.string().optional(),
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
})

export const verifyEmailSchema = z.object({
  code: z.string().length(6),
})

export const createListingSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  address: z.string().min(1),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  price_per_semester: z.number().positive(),
  bedrooms: z.number().int().positive(),
  bathrooms: z.number().int().positive(),
  is_furnished: z.boolean().optional(),
  has_wifi: z.boolean().optional(),
  has_security: z.boolean().optional(),
  has_backup_power: z.boolean().optional(),
  has_water: z.boolean().optional(),
  images: z.array(z.string().url()).optional(),
})

export const updateListingSchema = createListingSchema.partial()

export const bookingCreateSchema = z.object({
  listing_id: z.string(),
  semester: z.string(),
  academic_year: z.string(),
  message: z.string().optional(),
})

export const bookingStatusSchema = z.object({
  status: z.enum(['accepted', 'rejected', 'cancelled', 'completed']),
})

export const reviewSchema = z.object({
  booking_id: z.string(),
  reviewee_id: z.string(),
  listing_id: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
})

export const conversationCreateSchema = z.object({
  listing_id: z.string(),
  homeowner_id: z.string().optional(),
})

export const messageSchema = z.object({
  body: z.string().min(1),
})

export const savedToggleSchema = z.object({
  listing_id: z.string(),
})

export const listingImagesSchema = z.object({
  urls: z.array(z.string().url()).max(7),
})

export const replaceListingImagesSchema = z.object({
  images: z
    .array(
      z.object({
        url: z.string().url(),
        is_primary: z.boolean(),
      })
    )
    .min(1)
    .max(7),
})

export const profilePatchSchema = z.object({
  full_name: z.string().min(1).optional(),
  phone: z.string().optional(),
  avatar_url: z.string().url().optional().nullable(),
  student_id_url: z.string().url().optional().nullable(),
  national_id_url: z.string().url().optional().nullable(),
  program: z.string().optional(),
  year_of_study: z.number().int().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
})
