'use client'

import React from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useQueryState } from "nuqs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Quote } from "lucide-react"
import type { Quote as QuoteType, ApiResponse } from "@/lib/types"
import type { EnrichedQuote } from "@/lib/quote-enricher"

interface QuotesListHydratedProps {
  initialData: ApiResponse<QuoteType>
}

export function QuotesListHydrated({ initialData }: QuotesListHydratedProps) {
  const queryClient = useQueryClient()
  const [search, setSearch] = useQueryState('search')
  const [page, setPage] = useQueryState('page', { parse: parseInt })
  
  const limit = 20

  React.useEffect(() => {
    queryClient.setQueryData(['quotes', { page: 1, limit }], initialData)
  }, [initialData, queryClient, limit])

  const { data, isLoading, error } = useQuery({
    queryKey: ['quotes', { search, page: page || 1, limit }],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        page: (page || 1).toString(),
        ...(search && { dialog: `/${search}/i` }),
      })
      
      const response = await fetch(`/api/quotes?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch quotes')
      }
      return response.json()
    },
    initialData: !search && (page || 1) === 1 ? initialData : undefined,
    retry: 1,
  })

  const handleSearchChange = (value: string) => {
    setSearch(value || null)
    setPage(1)
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground mb-4">
            Failed to load quotes. Please try again later.
          </p>
          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
              Error Details
            </summary>
            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          </details>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search size={20} />
            Search Quotes
          </CardTitle>
          <CardDescription>
            Find memorable quotes from The Lord of the Rings trilogy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search quotes by text..."
              value={search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <QuotesListSkeleton />
      ) : (
        <>
          {data && (
            <div className="text-center text-muted-foreground">
              Found {data.total} quotes
              {search && ' matching your search'}
            </div>
          )}
          
          <div className="grid gap-6 md:grid-cols-2">
            {data?.docs.map((quote: EnrichedQuote) => (
              <Card key={quote._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Quote className="text-muted-foreground mt-1 flex-shrink-0" size={20} />
                    <div className="flex-1">
                      <blockquote className="text-lg italic leading-relaxed">
                        &ldquo;{quote.dialog}&rdquo;
                      </blockquote>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {quote.characterName ? quote.characterName.slice(0, 2).toUpperCase() : '??'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {quote.characterName || 'Unknown Character'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {quote.movieName || 'Unknown Movie'}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Quote</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {data && data.pages && data.pages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const newPage = Math.max(1, (page || 1) - 1)
                  setPage(newPage)
                }}
                disabled={(page || 1) <= 1}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, data.pages || 0) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min((data.pages || 0) - 4, (page || 1) - 2)) + i
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === (page || 1) ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              
              <Button
                variant="outline"
                onClick={() => {
                  const newPage = Math.min(data.pages || 1, (page || 1) + 1)
                  setPage(newPage)
                }}
                disabled={(page || 1) >= (data.pages || 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function QuotesListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-start gap-3">
              <Skeleton className="w-5 h-5 mt-1" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32 mt-1" />
                </div>
              </div>
              <Skeleton className="h-5 w-12" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}