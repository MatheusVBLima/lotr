import { apiClient } from "@/lib/api"
import { ModernHeader } from "@/components/modern-header"
import { MoviesListCached } from "@/components/movies-list-cached"
import { headers } from 'next/headers'

// Use ISR for better performance  
export const revalidate = 3600 // Revalidate every hour

export default async function MoviesPage() {
  // Get locale from middleware header
  const headersList = await headers()
  const locale = headersList.get('x-locale') || 'en'
  
  console.log(`🎬 [MOVIES PAGE] Rendering with locale: ${locale}`);
  
  // Load messages manually
  let messages = {};
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    messages = (await import(`../../../messages/en.json`)).default;
  }
  
  // Simple translation function
  const t = (key: string) => {
    const keys = key.split('.');
    let value = messages;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };
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
          <h2 className="text-3xl font-bold tracking-tight">{t('movies.title')}</h2>
          <p className="text-lg text-muted-foreground">
            {t('movies.subtitle')}
          </p>
        </div>

        <MoviesListCached initialData={initialMovies} locale={locale} />
      </main>
    </div>
  )
}