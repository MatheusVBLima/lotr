import { ModernHeader } from "@/components/modern-header"
import { QuotesListHydrated } from "@/components/quotes-list-hydrated"
import { apiClient } from "@/lib/api"
import { enrichQuotes } from "@/lib/quote-enricher"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Use dynamic rendering only when needed
export const dynamic = 'auto'
export const revalidate = 3600 // Revalidate every hour

export default async function QuotesPage() {
  // Check if API token is available before making requests
  const API_TOKEN = process.env.THE_ONE_API_TOKEN
  if (!API_TOKEN) {
    console.warn('⚠️  API token not available during build - using empty data')
    return (
      <div className="min-h-screen bg-background">
        <ModernHeader />
        <main className="container mx-auto px-4 py-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">All Quotes</h2>
            <p className="text-lg text-muted-foreground">
              Discover the most memorable lines from Middle-earth
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Content will be available once API is properly configured.
            </p>
          </div>
          <Suspense fallback={<QuotesListSkeleton />}>
            <QuotesListHydrated initialData={{ docs: [], total: 0, limit: 20, page: 1, pages: 0 }} />
          </Suspense>
        </main>
      </div>
    )
  }

  try {
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

          <Suspense fallback={<QuotesListSkeleton />}>
            <QuotesListHydrated initialData={initialQuotes} />
          </Suspense>
        </main>
      </div>
    )
  } catch (error) {
    console.error('❌ Error fetching quotes:', error)
    return (
      <div className="min-h-screen bg-background">
        <ModernHeader />
        <main className="container mx-auto px-4 py-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">All Quotes</h2>
            <p className="text-lg text-muted-foreground">
              Discover the most memorable lines from Middle-earth
            </p>
            <p className="text-sm text-red-500 mt-4">
              Error loading quotes. Please try again later.
            </p>
          </div>
          <Suspense fallback={<QuotesListSkeleton />}>
            <QuotesListHydrated initialData={{ docs: [], total: 0, limit: 20, page: 1, pages: 0 }} />
          </Suspense>
        </main>
      </div>
    )
  }
}

function QuotesListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search Skeleton */}
      <div className="border rounded-lg p-6">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-64 mb-4" />
        <Skeleton className="h-10 w-full" />
      </div>
      
      {/* Quotes Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-6">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}