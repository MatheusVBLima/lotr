import { Suspense } from "react"
import { notFound } from "next/navigation"
import { apiClient } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ModernHeader } from "@/components/modern-header"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { getLocale } from 'next-intl/server'
import { translateApiContent } from "@/lib/api-translations"

interface CharacterPageProps {
  params: Promise<{ id: string }>
}

async function CharacterDetails({ characterId, locale = 'en' }: { characterId: string, locale?: string }) {
  try {
    const character = await apiClient.getCharacter(characterId)
    
    if (!character) {
      notFound()
    }

    return (
      <div className="space-y-8">
        <Card>
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarFallback className="text-2xl font-bold">
                {character.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl">{character.name}</CardTitle>
            {character.race && (
              <CardDescription className="text-lg">{character.race}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2 flex-wrap justify-center">
              {character.race && (
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {translateApiContent(character.race, locale)}
                </Badge>
              )}
              {character.gender && character.gender !== 'NaN' && (
                <Badge variant="outline" className="text-base px-3 py-1">
                  {translateApiContent(character.gender, locale)}
                </Badge>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {character.realm && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{translateApiContent('realm', locale)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl">{character.realm}</p>
                  </CardContent>
                </Card>
              )}

              {character.birth && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{translateApiContent('birth', locale)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl">{character.birth}</p>
                  </CardContent>
                </Card>
              )}

              {character.spouse && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{translateApiContent('spouse', locale)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl">{character.spouse}</p>
                  </CardContent>
                </Card>
              )}

              {character.death && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{translateApiContent('death', locale)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl">{character.death}</p>
                  </CardContent>
                </Card>
              )}

              {character.hair && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{translateApiContent('hairColor', locale)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl">{character.hair}</p>
                  </CardContent>
                </Card>
              )}

              {character.height && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{translateApiContent('height', locale)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl">{character.height}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild>
                <Link href={`/characters/${character._id}/quotes`}>
                  {translateApiContent('viewQuotesBy', locale)} {character.name}
                </Link>
              </Button>
              
              {character.wikiUrl && (
                <Button asChild variant="outline">
                  <a 
                    href={character.wikiUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink size={16} />
                    {translateApiContent('wikiPage', locale)}
                  </a>
                </Button>
              )}
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
            {translateApiContent('failedToLoad', locale)} character {translateApiContent('detailsText', locale)}
          </p>
        </CardContent>
      </Card>
    )
  }
}

function CharacterDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="text-center">
          <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-5 w-24 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2 justify-center">
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-7 w-16" />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex gap-4 justify-center">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-28" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { id } = await params
  
  const locale = await getLocale()

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Button asChild variant="outline">
          <Link href="/characters" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            {translateApiContent('backTo', locale)} {translateApiContent('characters', locale)}
          </Link>
        </Button>

        <Suspense fallback={<CharacterDetailsSkeleton />}>
          <CharacterDetails characterId={id} locale={locale} />
        </Suspense>
      </main>
    </div>
  )
}