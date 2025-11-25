import { apiClient } from "@/lib/api"
import { ModernHeader } from "@/components/modern-header"
import { QuotesListHydrated } from "@/components/quotes-list-hydrated"
import { enrichQuotes } from "@/lib/quote-enricher"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { ArrowLeft, User } from "lucide-react"
import { getLocale } from 'next-intl/server'
import { translateApiContent } from "@/lib/api-translations"

interface CharacterQuotesPageProps {
  params: Promise<{ id: string }>
}

export default async function CharacterQuotesPage({ params }: CharacterQuotesPageProps) {
  const { id } = await params
  const locale = await getLocale()
  let character
  let initialQuotes

  try {
    // Fetch character details and quotes in parallel
    const [characterData, quotesData] = await Promise.all([
      apiClient.getCharacter(id),
      apiClient.getCharacterQuotes(id, { limit: 20, page: 1 })
    ])
    
    character = characterData
    const enrichedQuotes = await enrichQuotes(quotesData.docs)
    initialQuotes = {
      ...quotesData,
      docs: enrichedQuotes
    }
  } catch (error) {
    console.error('Failed to fetch character or quotes:', error)
    return (
      <div className="min-h-screen bg-background">
        <ModernHeader />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                Character not found or failed to load quotes.
              </p>
              <Button asChild className="mt-4">
                <Link href="/characters">Back to Characters</Link>
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
        {/* Back button and character info */}
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/characters" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              {translateApiContent('backTo', locale)} {translateApiContent('characters', locale)}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/characters/${id}`} className="flex items-center gap-2">
              <User size={16} />
              {translateApiContent('characterDetails', locale)}
            </Link>
          </Button>
        </div>

        {/* Character header */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardHeader className="text-center">
            <Avatar className="w-20 h-20 mx-auto mb-4">
              <AvatarFallback className="text-2xl font-bold">
                {character.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl">{character.name}</CardTitle>
            <CardDescription className="text-lg">
              {translateApiContent('quotesDescription', locale)}
            </CardDescription>
            <div className="flex gap-2 justify-center mt-4 flex-wrap">
              {character.race && (
                <Badge variant="secondary">{translateApiContent(character.race, locale)}</Badge>
              )}
              {character.gender && character.gender !== 'NaN' && (
                <Badge variant="outline">{translateApiContent(character.gender, locale)}</Badge>
              )}
              {character.realm && (
                <Badge variant="outline">{character.realm}</Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Quotes section */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">{translateApiContent('characterQuotes', locale)}</h2>
          <p className="text-muted-foreground">
            {initialQuotes.total > 0 
              ? `${translateApiContent('discoverQuotes', locale)} ${character.name}`
              : `${translateApiContent('noQuotesFound', locale)} ${character.name}`
            }
          </p>
        </div>

        {initialQuotes.total > 0 ? (
          <QuotesListHydrated initialData={initialQuotes} locale={locale} />
        ) : (
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-6xl">💬</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{translateApiContent('noQuotesAvailable', locale)}</h3>
                <p className="text-muted-foreground mb-4">
                  {translateApiContent('characterNoQuotes', locale)}
                </p>
                <div className="flex gap-2 justify-center">
                  <Button asChild variant="outline">
                    <Link href="/quotes">{translateApiContent('browseAllQuotes', locale)}</Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/characters/${id}`}>{translateApiContent('viewDetails', locale)}</Link>
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