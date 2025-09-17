import { supabase } from './supabase'
import { Solution, CountryNeighbor, UserInput, UserSelection } from '@/types/database'

export class SolutionService {

  /**
   * Get neighboring countries for a given country
   */
  static async getNeighboringCountries(country: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('countries_neighbors')
        .select('neighbor_countries')
        .eq('country_name', country)
        .single()

      if (error) {
        console.warn(`No neighbors found for ${country}:`, error)
        return []
      }

      return data?.neighbor_countries || []
    } catch (error) {
      console.error('Error fetching neighboring countries:', error)
      return []
    }
  }

  /**
   * Get expanded country list including neighbors for better matching
   */
  static async getExpandedCountryList(country: string): Promise<string[]> {
    const neighbors = await this.getNeighboringCountries(country)
    return [country, ...neighbors]
  }

  /**
   * Find solutions based on user input with neighboring country logic
   */
  static async findSolutions(userInput: UserInput): Promise<Solution[]> {
    try {
      // Get expanded country list including neighbors
      const expandedCountries = await this.getExpandedCountryList(userInput.location)

      // Build query for solutions with images
      let query = supabase
        .from('solutions')
        .select(`
          *,
          solution_images (
            id,
            solution_id,
            image_type,
            image_url
          )
        `)

      // Filter by challenge type
      query = query.overlaps('applicable_challenges', [userInput.challenge])

      // Filter by countries (exact match OR neighboring countries)
      query = query.overlaps('applicable_countries', expandedCountries)

      const { data, error } = await query

      if (error) {
        console.error('Error fetching solutions:', error)
        return []
      }

      // Sort results - prioritize exact country match over neighbors
      const sortedSolutions = (data || []).sort((a, b) => {
        const aHasExactMatch = a.applicable_countries.includes(userInput.location)
        const bHasExactMatch = b.applicable_countries.includes(userInput.location)

        if (aHasExactMatch && !bHasExactMatch) return -1
        if (!aHasExactMatch && bHasExactMatch) return 1
        return 0
      })

      return sortedSolutions
    } catch (error) {
      console.error('Error in findSolutions:', error)
      return []
    }
  }

  /**
   * Get role-specific content from a solution
   */
  static getRoleSpecificContent(solution: Solution, role: string): string | undefined {
    const roleKey = `${role.toLowerCase().replace(' ', '')}_text` as keyof Solution
    return solution[roleKey] as string | undefined
  }

  /**
   * Save user selection for analytics (optional)
   */
  static async saveUserSelection(userInput: UserInput, sessionId?: string): Promise<void> {
    try {
      const selection: Partial<UserSelection> = {
        role_type: userInput.isCustomRole ? undefined : userInput.role,
        challenge_type: userInput.isCustomChallenge ? undefined : userInput.challenge,
        location_type: userInput.isCustomLocation ? undefined : userInput.location,
        custom_role_text: userInput.isCustomRole ? userInput.role : undefined,
        custom_challenge_text: userInput.isCustomChallenge ? userInput.challenge : undefined,
        custom_location_text: userInput.isCustomLocation ? userInput.location : undefined,
        session_id: sessionId
      }

      const { error } = await supabase
        .from('user_selections')
        .insert(selection)

      if (error) {
        console.warn('Error saving user selection:', error)
      }
    } catch (error) {
      console.warn('Error in saveUserSelection:', error)
    }
  }

  /**
   * Get all countries for dropdown
   */
  static async getAllCountries(): Promise<CountryNeighbor[]> {
    try {
      const { data, error } = await supabase
        .from('countries_neighbors')
        .select('*')
        .order('country_name')

      if (error) {
        console.error('Error fetching countries:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getAllCountries:', error)
      return []
    }
  }

  /**
   * Get solution by ID with images
   */
  static async getSolutionById(id: string): Promise<Solution | null> {
    try {
      const { data, error } = await supabase
        .from('solutions')
        .select(`
          *,
          solution_images (
            id,
            solution_id,
            image_type,
            image_url
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching solution:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in getSolutionById:', error)
      return null
    }
  }

  /**
   * Get all solutions with images for initial display
   */
  static async getAllSolutions(): Promise<Solution[]> {
    try {
      const { data, error } = await supabase
        .from('solutions')
        .select(`
          *,
          solution_images (
            id,
            solution_id,
            image_type,
            image_url
          )
        `)
        .order('solution_title')

      if (error) {
        console.error('Error fetching all solutions:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in getAllSolutions:', error)
      return []
    }
  }
}