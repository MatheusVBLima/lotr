import type { 
  ApiResponse, 
  Book, 
  Movie, 
  Character, 
  Quote, 
  Chapter, 
  QueryParams,
  CharacterFilters,
  QuoteFilters,
  MovieFilters
} from './types'

const API_BASE_URL = process.env.THE_ONE_API_BASE_URL || 'https://the-one-api.dev/v2'
const API_TOKEN = process.env.THE_ONE_API_TOKEN

class ApiClient {
  private async fetchWithAuth<T = any>(endpoint: string, params?: QueryParams): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString())
        }
      })
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Add authorization header only for endpoints that require it
    const needsAuth = !endpoint.startsWith('/book')
    if (needsAuth && API_TOKEN) {
      headers['Authorization'] = `Bearer ${API_TOKEN}`
    }

    const response = await fetch(url.toString(), { 
      headers,
      // Use no-cache for development to avoid stale data issues
      cache: process.env.NODE_ENV === 'development' ? 'no-store' : 'default',
      next: { 
        revalidate: endpoint.startsWith('/book') ? false : 3600
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorText}`)
    }

    return response.json()
  }

  // Books (no auth required)
  async getBooks(params?: QueryParams): Promise<ApiResponse<Book>> {
    return this.fetchWithAuth<ApiResponse<Book>>('/book', params)
  }

  async getBook(id: string): Promise<Book> {
    const response = await this.fetchWithAuth<ApiResponse<Book>>(`/book/${id}`)
    return response.docs[0]
  }

  async getBookChapters(bookId: string, params?: QueryParams): Promise<ApiResponse<Chapter>> {
    return this.fetchWithAuth<ApiResponse<Chapter>>(`/book/${bookId}/chapter`, params)
  }

  // Movies (auth required)
  async getMovies(filters?: MovieFilters, params?: QueryParams): Promise<ApiResponse<Movie>> {
    const queryParams = { ...params, ...filters }
    return this.fetchWithAuth<ApiResponse<Movie>>('/movie', queryParams)
  }

  async getMovie(id: string): Promise<Movie> {
    const response = await this.fetchWithAuth<ApiResponse<Movie>>(`/movie/${id}`)
    return response.docs[0]
  }

  async getMovieQuotes(movieId: string, params?: QueryParams): Promise<ApiResponse<Quote>> {
    return this.fetchWithAuth<ApiResponse<Quote>>(`/movie/${movieId}/quote`, params)
  }

  // Characters (auth required)
  async getCharacters(filters?: CharacterFilters, params?: QueryParams): Promise<ApiResponse<Character>> {
    const queryParams = { ...params }
    
    // Add filters properly
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams[key] = value
        }
      })
    }
    
    return this.fetchWithAuth<ApiResponse<Character>>('/character', queryParams)
  }

  async getCharacter(id: string): Promise<Character> {
    const response = await this.fetchWithAuth<ApiResponse<Character>>(`/character/${id}`)
    return response.docs[0]
  }

  async getCharacterQuotes(characterId: string, params?: QueryParams): Promise<ApiResponse<Quote>> {
    return this.fetchWithAuth<ApiResponse<Quote>>(`/character/${characterId}/quote`, params)
  }

  // Quotes (auth required)
  async getQuotes(filters?: QuoteFilters, params?: QueryParams): Promise<ApiResponse<Quote>> {
    const queryParams = { ...params, ...filters }
    return this.fetchWithAuth<ApiResponse<Quote>>('/quote', queryParams)
  }

  async getQuote(id: string): Promise<Quote> {
    const response = await this.fetchWithAuth<ApiResponse<Quote>>(`/quote/${id}`)
    return response.docs[0]
  }

  // Chapters (auth required)
  async getChapters(params?: QueryParams): Promise<ApiResponse<Chapter>> {
    return this.fetchWithAuth<ApiResponse<Chapter>>('/chapter', params)
  }

  async getChapter(id: string): Promise<Chapter> {
    const response = await this.fetchWithAuth<ApiResponse<Chapter>>(`/chapter/${id}`)
    return response.docs[0]
  }
}

export const apiClient = new ApiClient()

// Query Keys for TanStack Query
export const queryKeys = {
  books: ['books'] as const,
  book: (id: string) => ['books', id] as const,
  bookChapters: (bookId: string) => ['books', bookId, 'chapters'] as const,
  
  movies: (filters?: MovieFilters, params?: QueryParams) => ['movies', filters, params] as const,
  movie: (id: string) => ['movies', id] as const,
  movieQuotes: (movieId: string) => ['movies', movieId, 'quotes'] as const,
  
  characters: (filters?: CharacterFilters, params?: QueryParams) => ['characters', filters, params] as const,
  character: (id: string) => ['characters', id] as const,
  characterQuotes: (characterId: string) => ['characters', characterId, 'quotes'] as const,
  
  quotes: (filters?: QuoteFilters, params?: QueryParams) => ['quotes', filters, params] as const,
  quote: (id: string) => ['quotes', id] as const,
  
  chapters: ['chapters'] as const,
  chapter: (id: string) => ['chapters', id] as const,
}