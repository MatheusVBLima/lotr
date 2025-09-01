import { apiClient } from "@/lib/api"
import { ModernHeader } from "@/components/modern-header"
import { MoviesListCached } from "@/components/movies-list-cached"

// Use ISR for better performance  
export const revalidate = 3600 // Revalidate every hour

export default async function MoviesPage() {
  let initialMovies

  try {
    console.log('Server: Fetching movies...')
    initialMovies = await apiClient.getMovies({}, { limit: 20 })
    console.log('Server: Movies fetched successfully:', initialMovies.docs?.length, 'movies')
  } catch (error) {
    console.error('Server: Failed to fetch movies:', error)
    initialMovies = { docs: [], total: 0, limit: 20, page: 1, pages: 0 }
  }

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">All Movies</h2>
          <p className="text-lg text-muted-foreground">
            Discover Peter Jackson&apos;s Middle-earth film saga
          </p>
        </div>

        <MoviesListCached initialData={initialMovies} />
      </main>
    </div>
  )
}