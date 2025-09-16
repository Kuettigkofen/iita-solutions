// Database type definitions for IITA Solutions

export interface Solution {
  id: string
  solution_title: string
  applicable_countries: string[]
  applicable_challenges: string[]
  executive_summary_text?: string
  problem_title?: string
  problem_bulletpoint_1?: string
  problem_bulletpoint_2?: string
  problem_bulletpoint_3?: string
  problem_bulletpoint_4?: string
  solution_title_field?: string
  solution_bulletpoint_1?: string
  solution_bulletpoint_2?: string
  solution_bulletpoint_3?: string
  solution_bulletpoint_4?: string
  resources_technicalguides?: string
  resources_digitaltools?: string
  resources_researchpublications?: string
  resources_trainingmaterials?: string
  impact_text?: string

  // Role-specific content
  funder_text?: string
  policymaker_text?: string
  farmer_text?: string
  student_text?: string
  extensionofficer_text?: string
  researcher_text?: string
  devpractitioner_text?: string

  created_at: string
  updated_at: string
}

export interface CountryNeighbor {
  id: string
  country_name: string
  neighbor_countries: string[]
  region: string
  created_at: string
}

export interface UserSelection {
  id: string
  role_type?: string
  challenge_type?: string
  location_type?: string
  custom_role_text?: string
  custom_challenge_text?: string
  custom_location_text?: string
  session_id?: string
  created_at: string
}

// Enum types for dropdown options
export const ROLE_TYPES = [
  'development_practitioner',
  'researcher',
  'extension_officer',
  'policymaker',
  'funder',
  'student',
  'farmer'
] as const

export const CHALLENGE_TYPES = [
  'cocoa',
  'cotton',
  'coffee',
  'maize',
  'beans',
  'livestock',
  'cassava',
  'rice',
  'yam',
  'plantain',
  'sweet_potato',
  'banana',
  'mushroom',
  'beekeeping',
  'aquaculture',
  'agroforestry',
  'soil_fertility',
  'pest_management',
  'climate_information',
  'digital_services',
  'processing',
  'storage',
  'nutrition',
  'water_management',
  'renewable_energy',
  'greenhouse',
  'agroecology',
  'biofortification',
  'value_chains',
  'farmer_training',
  'climate_resilience'
] as const

export const LOCATION_TYPES = [
  'Nigeria',
  'Ghana',
  'Kenya',
  'Tanzania',
  'Uganda',
  'Mali',
  'Burkina Faso',
  'Cameroon',
  'Ethiopia',
  'Madagascar',
  'Mozambique',
  'Angola',
  'Zambia',
  'Zimbabwe',
  'Botswana',
  'South Africa',
  'Namibia',
  'Democratic Republic of Congo',
  'Central African Republic',
  'Chad',
  'Sudan',
  'South Sudan',
  'Rwanda',
  'Burundi'
] as const

export type RoleType = typeof ROLE_TYPES[number]
export type ChallengeType = typeof CHALLENGE_TYPES[number]
export type LocationType = typeof LOCATION_TYPES[number]

// User input interface
export interface UserInput {
  role: RoleType | string
  challenge: ChallengeType | string
  location: LocationType | string
  isCustomRole?: boolean
  isCustomChallenge?: boolean
  isCustomLocation?: boolean
}