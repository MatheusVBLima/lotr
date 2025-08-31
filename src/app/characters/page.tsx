import { ModernHeader } from "@/components/modern-header"
import { CharactersListHydrated } from "@/components/characters-list-hydrated"
import { apiClient } from "@/lib/api"

// Force dynamic rendering to avoid prerendering issues with API tokens
export const dynamic = 'force-dynamic'

// Server Component - fetches data directly with token
export default async function CharactersPage() {
  // Check if API token is available before making requests
  const API_TOKEN = process.env.THE_ONE_API_TOKEN
  if (!API_TOKEN) {
    console.warn('⚠️  API token not available during build - using empty data')
    return (
      <div className="min-h-screen bg-background">
        <ModernHeader />
        <main className="container mx-auto px-4 py-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">All Characters</h2>
            <p className="text-lg text-muted-foreground">
              From Hobbits to Wizards, explore every character in Tolkien&apos;s universe
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Content will be available once API is properly configured.
            </p>
          </div>
          <CharactersListHydrated initialData={{ docs: [], total: 0, limit: 12, page: 1, pages: 0 }} />
        </main>
      </div>
    )
  }

  try {
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
  } catch (error) {
    console.error('❌ Error fetching characters:', error)
    return (
      <div className="min-h-screen bg-background">
        <ModernHeader />
        <main className="container mx-auto px-4 py-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">All Characters</h2>
            <p className="text-lg text-muted-foreground">
              From Hobbits to Wizards, explore every character in Tolkien&apos;s universe
            </p>
            <p className="text-sm text-red-500 mt-4">
              Error loading characters. Please try again later.
            </p>
          </div>
          <CharactersListHydrated initialData={{ docs: [], total: 0, limit: 12, page: 1, pages: 0 }} />
        </main>
      </div>
    )
  }
}