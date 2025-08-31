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

interface CharacterQuotesPageProps {
  params: { id: string }
}

export default async function CharacterQuotesPage({ params }: CharacterQuotesPageProps) {
  let character
  let initialQuotes

  try {
    // Fetch character details and quotes in parallel
    const [characterData, quotesData] = await Promise.all([
      apiClient.getCharacter(params.id),
      apiClient.getCharacterQuotes(params.id, { limit: 20, page: 1 })
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
              Back to Characters
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/characters/${params.id}`} className="flex items-center gap-2">
              <User size={16} />
              Character Details
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
              All memorable quotes from this character
            </CardDescription>
            <div className="flex gap-2 justify-center mt-4 flex-wrap">
              {character.race && (
                <Badge variant="secondary">{character.race}</Badge>
              )}
              {character.gender && character.gender !== 'NaN' && (
                <Badge variant="outline">{character.gender}</Badge>
              )}
              {character.realm && (
                <Badge variant="outline">{character.realm}</Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Quotes section */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Character Quotes</h2>
          <p className="text-muted-foreground">
            {initialQuotes.total > 0 
              ? `Discover the most memorable lines from ${character.name}`
              : `No quotes found for ${character.name} in the database`
            }
          </p>
        </div>

        {initialQuotes.total > 0 ? (
          <QuotesListHydrated initialData={initialQuotes} />
        ) : (
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-6xl">💬</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">No Quotes Available</h3>
                <p className="text-muted-foreground mb-4">
                  This character doesn&apos;t have any recorded quotes in The One API database, 
                  or they may be from scenes not included in the dataset.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button asChild variant="outline">
                    <Link href="/quotes">Browse All Quotes</Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/characters/${params.id}`}>View Character Details</Link>
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