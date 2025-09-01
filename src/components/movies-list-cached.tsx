'use client'

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Movie, ApiResponse } from "@/lib/types"
import { translateApiContent, translateMovieTitle } from "@/lib/api-translations"

interface MoviesListCachedProps {
  initialData?: ApiResponse<Movie>
  locale?: string
}

export function MoviesListCached({ initialData, locale = 'en' }: MoviesListCachedProps) {
  console.log('MoviesListCached received initialData:', !!initialData, initialData?.docs?.length)
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['movies'],
    queryFn: async () => {
      console.log('Client: queryFn executing...')
      const result = await apiClient.getMovies({}, { limit: 20 })
      console.log('Client: queryFn result:', result.docs?.length)
      return result
    },
    initialData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  })

  console.log('Movies query state:', { 
    hasData: !!data, 
    dataCount: data?.docs?.length,
    isLoading, 
    error: error?.message 
  })

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            Failed to load movies. Please try again later.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return <MoviesListSkeleton />
  }

  const movies = data?.docs || []

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {movies.map((movie: Movie) => (
        <Card key={movie._id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">{translateMovieTitle(movie.name, locale)}</CardTitle>
            <CardDescription>
              {movie.runtimeInMinutes} {translateApiContent('minutes', locale)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">
                ${movie.budgetInMillions}M {translateApiContent('budget', locale)}
              </Badge>
              <Badge variant="outline">
                ${movie.boxOfficeRevenueInMillions}M {translateApiContent('boxOffice', locale)}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{translateApiContent('awards', locale)}:</span>
                <span>{movie.academyAwardWins}/{movie.academyAwardNominations}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{translateApiContent('rottenTomatoes', locale)}:</span>
                <span>{movie.rottenTomatoesScore}%</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/movies/${movie._id}`}>
                  {translateApiContent('viewDetails', locale)}
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href={`/movies/${movie._id}/quotes`}>
                  {translateApiContent('viewQuotes', locale)}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function MoviesListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-8" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}