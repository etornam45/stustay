export type UserRole = 'student' | 'homeowner' | 'admin'

export interface UserPublic {
  id: string
  email: string
  role: UserRole
  full_name: string
  phone: string | null
  avatar_url: string | null
  is_verified: boolean
  created_at: string
}

export interface StudentProfile {
  user_id: string
  university: string
  student_id_url: string | null
  program: string | null
  year_of_study: number | null
}

export interface HomeownerProfile {
  user_id: string
  national_id_url: string | null
  address: string | null
  bio: string | null
}
