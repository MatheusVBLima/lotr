import { apiClient } from './api'
import type { Quote } from './types'

export interface EnrichedQuote extends Quote {
  characterName?: string
  movieName?: string
}

export async function enrichQuotes(quotes: Quote[]): Promise<EnrichedQuote[]> {
  if (!quotes.length) return quotes

  // Get unique character and movie IDs
  const characterIds = [...new Set(quotes.map(q => q.character).filter(Boolean))]
  const movieIds = [...new Set(quotes.map(q => q.movie).filter(Boolean))]

  // Fetch characters and movies in parallel
  const [charactersData, moviesData] = await Promise.all([
    Promise.all(characterIds.map(async (id) => {
      try {
        const character = await apiClient.getCharacter(id)
        return { id, name: character.name }
      } catch {
        return { id, name: 'Unknown Character' }
      }
    })),
    Promise.all(movieIds.map(async (id) => {
      try {
        const movie = await apiClient.getMovie(id)
        return { id, name: movie.name }
      } catch {
        return { id, name: 'Unknown Movie' }
      }
    }))
  ])

  // Create lookup maps
  const characterMap = new Map(charactersData.map(c => [c.id, c.name]))
  const movieMap = new Map(moviesData.map(m => [m.id, m.name]))

  // Enrich quotes with names
  return quotes.map(quote => ({
    ...quote,
    characterName: quote.character ? characterMap.get(quote.character) : undefined,
    movieName: quote.movie ? movieMap.get(quote.movie) : undefined,
  }))
}