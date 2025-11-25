import { apiClient } from "@/lib/api"
import { ModernHeader } from "@/components/modern-header"
import { QuotesListHydrated } from "@/components/quotes-list-hydrated"
import { enrichQuotes } from "@/lib/quote-enricher"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Film } from "lucide-react"
import { getLocale } from 'next-intl/server'
import { translateApiContent } from "@/lib/api-translations"

interface MovieQuotesPageProps {
  params: Promise<{ id: string }>
}

export default async function MovieQuotesPage({ params }: MovieQuotesPageProps) {
  const { id } = await params
  const locale = await getLocale()
  let movie
  let initialQuotes

  try {
    // Fetch movie details and quotes in parallel
    const [movieData, quotesData] = await Promise.all([
      apiClient.getMovie(id),
      apiClient.getMovieQuotes(id, { limit: 20, page: 1 })
    ])
    
    movie = movieData
    const enrichedQuotes = await enrichQuotes(quotesData.docs)
    initialQuotes = {
      ...quotesData,
      docs: enrichedQuotes
    }
  } catch (error) {
    console.error('Failed to fetch movie or quotes:', error)
    return (
      <div className="min-h-screen bg-background">
        <ModernHeader />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                Movie not found or failed to load quotes.
              </p>
              <Button asChild className="mt-4">
                <Link href="/movies">Back to Movies</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Back button and movie info */}
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/movies" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              {translateApiContent('backTo', locale)} {translateApiContent('movies', locale)}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/movies/${id}`} className="flex items-center gap-2">
              <Film size={16} />
              {translateApiContent('movieDetails', locale)}
            </Link>
          </Button>
        </div>

        {/* Movie header */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Film className="text-primary" size={32} />
            </div>
            <CardTitle className="text-3xl">{movie.name}</CardTitle>
            <CardDescription className="text-lg">
              {translateApiContent('quotesDescription', locale)}
            </CardDescription>
            <div className="flex gap-2 justify-center mt-4">
              <Badge variant="secondary">
                {movie.runtimeInMinutes} {translateApiContent('minutes', locale)}
              </Badge>
              <Badge variant="outline">
                {movie.rottenTomatoesScore}% RT
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Quotes section */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">{translateApiContent('quotesTitle', locale)}</h2>
          <p className="text-muted-foreground">
            {initialQuotes.total > 0 
              ? `${translateApiContent('discoverQuotes', locale)} ${movie.name}`
              : `${translateApiContent('noQuotesAvailable', locale)} ${movie.name}`
            }
          </p>
        </div>

        {initialQuotes.total > 0 ? (
          <QuotesListHydrated initialData={initialQuotes} locale={locale} />
        ) : (
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-6xl">🎬</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{translateApiContent('noQuotesAvailable', locale)}</h3>
                <p className="text-muted-foreground mb-4">
                  {translateApiContent('quotesExplanation', locale)}
                </p>
                <div className="flex gap-2 justify-center">
                  <Button asChild variant="outline">
                    <Link href="/quotes">{translateApiContent('browseAllQuotes', locale)}</Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/movies/${id}`}>{translateApiContent('movieDetails', locale)}</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}