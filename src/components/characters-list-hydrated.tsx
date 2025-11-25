'use client'

import React from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useQueryState } from "nuqs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { Search, Filter } from "lucide-react"
import type { Character, ApiResponse } from "@/lib/types"
import { translateApiContent, translateCharacterField } from "@/lib/api-translations"

interface CharactersListHydratedProps {
  initialData: ApiResponse<Character>
  locale?: string
}

export function CharactersListHydrated({ initialData, locale = 'en' }: CharactersListHydratedProps) {
  const queryClient = useQueryClient()
  const [search, setSearch] = useQueryState('search')
  const [race, setRace] = useQueryState('race')
  const [gender, setGender] = useQueryState('gender')
  const [page, setPage] = useQueryState('page', { parse: parseInt })
  
  const limit = 12

  // Hydrate the initial data
  React.useEffect(() => {
    queryClient.setQueryData(['characters', { page: 1, limit }], initialData)
  }, [initialData, queryClient, limit])

  const { data, isLoading, error } = useQuery({
    queryKey: ['characters', { search, race, gender, page: page || 1, limit }],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        page: (page || 1).toString(),
        ...(search && { name: `/${search}/i` }),
        ...(race && { race }),
        ...(gender && gender !== 'all' && { gender }),
      })
      
      const response = await fetch(`/api/characters?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch characters')
      }
      return response.json()
    },
    initialData: !search && !race && !gender && (page || 1) === 1 ? initialData : undefined,
    retry: 1,
  })

  const handleSearchChange = (value: string) => {
    setSearch(value || null)
    setPage(1)
  }

  const handleRaceChange = (value: string) => {
    setRace(value === 'all' ? null : value)
    setPage(1)
  }

  const handleGenderChange = (value: string) => {
    setGender(value === 'all' ? null : value)
    setPage(1)
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground mb-4">
            {translateApiContent('failedToLoad', locale)} {translateApiContent('characters', locale)}. {translateApiContent('detailsText', locale)}
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
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} />
            {translateApiContent('charactersFiltersTitle', locale)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder={translateApiContent('charactersFiltersName', locale)}
                value={search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={race || 'all'} onValueChange={handleRaceChange}>
              <SelectTrigger>
                <SelectValue placeholder={translateApiContent('filterByRace', locale)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{translateApiContent('allRaces', locale)}</SelectItem>
                <SelectItem value="Hobbit">{translateApiContent('Hobbit', locale)}</SelectItem>
                <SelectItem value="Human">{translateApiContent('Human', locale)}</SelectItem>
                <SelectItem value="Elf">{translateApiContent('Elf', locale)}</SelectItem>
                <SelectItem value="Dwarf">{translateApiContent('Dwarf', locale)}</SelectItem>
                <SelectItem value="Wizard">{translateApiContent('Wizard', locale)}</SelectItem>
                <SelectItem value="Orc">{translateApiContent('Orc', locale)}</SelectItem>
                <SelectItem value="Uruk-hai">Uruk-hai</SelectItem>
              </SelectContent>
            </Select>

            <Select value={gender || 'all'} onValueChange={handleGenderChange}>
              <SelectTrigger>
                <SelectValue placeholder={translateApiContent('filterByGender', locale)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{translateApiContent('allGenders', locale)}</SelectItem>
                <SelectItem value="Male">{translateApiContent('Male', locale)}</SelectItem>
                <SelectItem value="Female">{translateApiContent('Female', locale)}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <CharactersListSkeleton />
      ) : (
        <>
          {data && (
            <div className="text-center text-muted-foreground">
              {translateApiContent('foundCharacters', locale)} {data.total} {translateApiContent('characters', locale)}
              {(search || race || gender) && ` ${translateApiContent('matchingFilters', locale)}`}
            </div>
          )}
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data?.docs.map((character: Character) => (
              <Card key={character._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-2">
                    <AvatarFallback className="text-lg font-semibold">
                      {character.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg">{character.name}</CardTitle>
                  {character.race && (
                    <CardDescription>{translateApiContent(character.race, locale)}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2 flex-wrap justify-center">
                    {character.race && (
                      <Badge variant="secondary">{translateApiContent(character.race, locale)}</Badge>
                    )}
                    {character.gender && character.gender !== 'NaN' && (
                      <Badge variant="outline">{translateApiContent(character.gender, locale)}</Badge>
                    )}
                  </div>
                  
                  {character.realm && (
                    <div className="text-sm text-center text-muted-foreground">
                      <strong>{translateApiContent('realm', locale)}:</strong> {character.realm}
                    </div>
                  )}

                  <div className="flex gap-2 justify-center">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/characters/${character._id}`}>
                        {translateApiContent('viewDetails', locale)}
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/characters/${character._id}/quotes`}>
                        {translateApiContent('viewQuotes', locale)}
                      </Link>
                    </Button>
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
                {translateApiContent('previous', locale)}
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
                {translateApiContent('next', locale)}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function CharactersListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <Card key={i}>
          <CardHeader className="text-center">
            <Skeleton className="w-16 h-16 rounded-full mx-auto mb-2" />
            <Skeleton className="h-5 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2 justify-center">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2 justify-center">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}