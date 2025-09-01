import { Suspense } from "react"
import { apiClient } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ModernHeader } from "@/components/modern-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { headers } from 'next/headers'
import { translateApiContent } from '@/lib/api-translations'

async function BooksOverview({ locale }: { locale: string }) {
  try {
    const booksResponse = await apiClient.getBooks()
    const books = booksResponse.docs

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <Card key={book._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{book.name}</CardTitle>
              <CardDescription>
                Part of The Lord of the Rings trilogy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="secondary">Book</Badge>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/books/${book._id}`}>
                    {translateApiContent('viewDetails', locale)}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/books/${book._id}/chapters`}>
                    {translateApiContent('viewChapters', locale)}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  } catch {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            Failed to load books. Please try again later.
          </p>
        </CardContent>
      </Card>
    )
  }
}

function BooksOverviewSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-5 w-16" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default async function Home() {
  // Get locale from middleware header
  const headersList = await headers()
  const locale = headersList.get('x-locale') || 'en'
  
  console.log(`🏠 [HOME PAGE] Rendering home page with locale: ${locale}`);
  
  // Load messages manually to avoid setRequestLocale issues
  let messages = {};
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
    console.log(`🌐 [HOME PAGE] Messages loaded for locale: ${locale}`);
  } catch (error) {
    console.log(`⚠️ [HOME PAGE] Failed to load messages for ${locale}, using fallback`);
    messages = (await import(`../../messages/en.json`)).default;
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
  return (
    <div className="min-h-screen bg-background">
      <ModernHeader />

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            {t('home.title')}
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            {t('home.subtitle')}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg">
              <Link href="/movies">{t('home.moviesCard.title')}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/characters">{t('home.charactersCard.title')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Books Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-bold tracking-tight">The Books</h3>
            <p className="text-lg text-muted-foreground">
              Start your journey with the original trilogy
            </p>
          </div>
          
          <Suspense fallback={<BooksOverviewSkeleton />}>
            <BooksOverview locale={locale} />
          </Suspense>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">3</CardTitle>
                <CardDescription>Books in the trilogy</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">6</CardTitle>
                <CardDescription>Movies total</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">900+</CardTitle>
                <CardDescription>Characters</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">2000+</CardTitle>
                <CardDescription>Memorable quotes</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>
            Built with love for Middle-earth • Data from{" "}
            <a 
              href="https://the-one-api.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline"
            >
              The One API
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}