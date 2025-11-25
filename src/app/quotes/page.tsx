import { ModernHeader } from "@/components/modern-header"
import { QuotesListHydrated } from "@/components/quotes-list-hydrated"
import { apiClient } from "@/lib/api"
import { enrichQuotes } from "@/lib/quote-enricher"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getLocale } from 'next-intl/server'

// Use dynamic rendering only when needed
export const dynamic = 'auto'
export const revalidate = 3600 // Revalidate every hour

export default async function QuotesPage() {
  const locale = await getLocale()
  
  console.log(`💬 [QUOTES PAGE] Rendering with locale: ${locale}`);
  
  // Load messages manually
  let messages = {};
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    messages = (await import(`../../../messages/en.json`)).default;
  }
  
  // Simple translation function
  const t = (key: string) => {
    const keys = key.split('.');
    let value = messages;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

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
            <h2 className="text-3xl font-bold tracking-tight">{t('quotes.title')}</h2>
            <p className="text-lg text-muted-foreground">
              {t('quotes.subtitle')}
            </p>
          </div>

          <Suspense fallback={<QuotesListSkeleton />}>
            <QuotesListHydrated initialData={initialQuotes} locale={locale} />
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
            <h2 className="text-3xl font-bold tracking-tight">{t('quotes.title')}</h2>
            <p className="text-lg text-muted-foreground">
              {t('quotes.subtitle')}
            </p>
            <p className="text-sm text-destructive mt-4">
              {t('common.error')}
            </p>
          </div>
          <Suspense fallback={<QuotesListSkeleton />}>
            <QuotesListHydrated initialData={{ docs: [], total: 0, limit: 20, page: 1, pages: 0 }} locale={locale} />
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