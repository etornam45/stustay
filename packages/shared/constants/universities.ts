export const UNIVERSITIES = [
  { name: 'University of Cape Coast', slug: 'ucc', city: 'Cape Coast' },
  { name: 'Cape Coast Technical University', slug: 'cctu', city: 'Cape Coast' },
] as const

export type UniversitySlug = (typeof UNIVERSITIES)[number]['slug']
