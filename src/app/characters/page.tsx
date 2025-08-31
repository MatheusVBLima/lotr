import { ModernHeader } from "@/components/modern-header"
import { CharactersListHydrated } from "@/components/characters-list-hydrated"
import { apiClient } from "@/lib/api"

// Server Component - fetches data directly with token
export default async function CharactersPage() {
  // Server-side fetch with authentication
  const initialCharacters = await apiClient.getCharacters({}, { limit: 12, page: 1 })

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">All Characters</h2>
          <p className="text-lg text-muted-foreground">
            From Hobbits to Wizards, explore every character in Tolkien&apos;s universe
          </p>
        </div>

        {/* Client Component with hydration */}
        <CharactersListHydrated initialData={initialCharacters} />
      </main>
    </div>
  )
}