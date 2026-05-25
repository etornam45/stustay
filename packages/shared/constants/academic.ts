export const SEMESTERS = ['First', 'Second'] as const

export const ACADEMIC_YEARS = [
  '2024/2025',
  '2025/2026',
  '2026/2027',
  '2027/2028',
] as const

export type Semester = (typeof SEMESTERS)[number]
export type AcademicYear = (typeof ACADEMIC_YEARS)[number]

/** Default booking selections for the current academic cycle. */
export function defaultAcademicYear(): AcademicYear {
  return '2025/2026'
}
