import { Suspense } from "react"
import { notFound } from "next/navigation"
import { apiClient } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ModernHeader } from "@/components/modern-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { headers } from 'next/headers'
import { translateApiContent, translateMovieTitle } from "@/lib/api-translations"

interface MoviePageProps {
  params: Promise<{ id: string }>
}

async function MovieDetails({ movieId, locale = 'en' }: { movieId: string, locale?: string }) {
  try {
    const movie = await apiClient.getMovie(movieId)
    
    if (!movie) {
      notFound()
    }

    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{translateMovieTitle(movie.name, locale)}</CardTitle>
            <CardDescription className="text-lg">
              {translateApiContent('runtime', locale)}: {movie.runtimeInMinutes} {translateApiContent('minutes', locale)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="text-base px-3 py-1">
                {translateApiContent('budget', locale)}: ${movie.budgetInMillions}M
              </Badge>
              <Badge variant="outline" className="text-base px-3 py-1">
                {translateApiContent('revenue', locale)}: ${movie.boxOfficeRevenueInMillions}M
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{translateApiContent('academyAwards', locale)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {movie.academyAwardWins} / {movie.academyAwardNominations}
                  </div>
                  <p className="text-muted-foreground">{translateApiContent('winsNominations', locale)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{translateApiContent('rottenTomatoes', locale)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{movie.rottenTomatoesScore}%</div>
                  <p className="text-muted-foreground">{translateApiContent('criticsScore', locale)}</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4">
              <Button asChild>
                <Link href={`/movies/${movie._id}/quotes`}>
                  {translateApiContent('viewQuotesFromMovie', locale)}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } catch {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            {translateApiContent('failedToLoad', locale)} movie {translateApiContent('detailsText', locale)}
          </p>
        </CardContent>
      </Card>
    )
  }
}

function MovieDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-7 w-28" />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12 mb-2" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          </div>
          
          <Skeleton className="h-10 w-48" />
        </CardContent>
      </Card>
    </div>
  )
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params
  
  // Get locale from middleware header
  const headersList = await headers()
  const locale = headersList.get('x-locale') || 'en'

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Button asChild variant="outline">
          <Link href="/movies" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            {translateApiContent('backTo', locale)} {translateApiContent('movies', locale)}
          </Link>
        </Button>

        <Suspense fallback={<MovieDetailsSkeleton />}>
          <MovieDetails movieId={id} locale={locale} />
        </Suspense>
      </main>
    </div>
  )
}