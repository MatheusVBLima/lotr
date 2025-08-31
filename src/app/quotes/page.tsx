import { ModernHeader } from "@/components/modern-header"
import { QuotesListHydrated } from "@/components/quotes-list-hydrated"
import { apiClient } from "@/lib/api"
import { enrichQuotes } from "@/lib/quote-enricher"

export default async function QuotesPage() {
  const quotesData = await apiClient.getQuotes({}, { limit: 20, page: 1 })
  const enrichedQuotes = await enrichQuotes(quotesData.docs)
  
  const initialQuotes = {
    ...quotesData,
    docs: enrichedQuotes
  }

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">All Quotes</h2>
          <p className="text-lg text-muted-foreground">
            Discover the most memorable lines from Middle-earth
          </p>
        </div>

        <QuotesListHydrated initialData={initialQuotes} />
      </main>
    </div>
  )
}