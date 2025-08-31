// API Response Types
export interface ApiResponse<T> {
  docs: T[]
  total: number
  limit: number
  offset?: number
  page?: number
  pages?: number
}

// Book Types
export interface Book {
  _id: string
  name: string
  chapter?: Chapter[]
}

export interface Chapter {
  _id: string
  chapterName: string
  book: string
}

// Movie Types
export interface Movie {
  _id: string
  name: string
  runtimeInMinutes: number
  budgetInMillions: number
  boxOfficeRevenueInMillions: number
  academyAwardNominations: number
  academyAwardWins: number
  rottenTomatoesScore: number
  quotes?: Quote[]
}

// Character Types
export interface Character {
  _id: string
  height?: string
  race?: string
  gender?: 'Male' | 'Female' | 'NaN'
  birth?: string
  spouse?: string
  death?: string
  realm?: string
  hair?: string
  name: string
  wikiUrl?: string
  quotes?: Quote[]
}

// Quote Types
export interface Quote {
  _id: string
  dialog: string
  movie: string
  character: string
  id?: string
}

// API Query Parameters
export interface QueryParams {
  limit?: number
  page?: number
  offset?: number
  sort?: string
  [key: string]: string | number | undefined
}

// Filter Types for Characters
export interface CharacterFilters {
  race?: string
  gender?: 'Male' | 'Female'
  realm?: string
  name?: string
}

// Filter Types for Quotes
export interface QuoteFilters {
  character?: string
  movie?: string
  dialog?: string
}

// Filter Types for Movies
export interface MovieFilters {
  name?: string
  budgetInMillions?: string
  academyAwardWins?: string
  runtimeInMinutes?: string
}