import { ModernHeader } from "@/components/modern-header"
import { CharactersListHydrated } from "@/components/characters-list-hydrated"
import { apiClient } from "@/lib/api"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getLocale } from 'next-intl/server'

// Use ISR for better performance
export const revalidate = 3600 // Revalidate every hour

// Server Component - fetches data directly with token
export default async function CharactersPage() {
  const locale = await getLocale()
  
  console.log(`👥 [CHARACTERS PAGE] Rendering with locale: ${locale}`);
  
  // Load messages manually
  let messages: Record<string, any> = {};
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    messages = (await import(`../../../messages/en.json`)).default;
  }

  // Simple translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = messages;
    for (const k of keys) {
      value = value?.[k];
    }
    return (typeof value === 'string' ? value : key);
  };
  try {
    // Server-side fetch with authentication
    const initialCharacters = await apiClient.getCharacters({}, { limit: 12, page: 1 })

    return (
      <div className="min-h-screen bg-background">
        <ModernHeader />

        <main className="container mx-auto px-4 py-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{t('characters.title')}</h2>
            <p className="text-lg text-muted-foreground">
              {t('characters.subtitle')}
            </p>
          </div>

          {/* Client Component with hydration */}
          <Suspense fallback={<CharactersListSkeleton />}>
            <CharactersListHydrated initialData={initialCharacters} locale={locale} />
          </Suspense>
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
            <h2 className="text-3xl font-bold tracking-tight">{t('characters.title')}</h2>
            <p className="text-lg text-muted-foreground">
              {t('characters.subtitle')}
            </p>
            <p className="text-sm text-destructive mt-4">
              {t('common.error')}
            </p>
          </div>
          <Suspense fallback={<CharactersListSkeleton />}>
            <CharactersListHydrated initialData={{ docs: [], total: 0, limit: 12, page: 1, pages: 0 }} locale={locale} />
          </Suspense>
        </main>
      </div>
    )
  }
}

function CharactersListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filters Skeleton */}
      <div className="border rounded-lg p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      
      {/* Characters Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-6">
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}