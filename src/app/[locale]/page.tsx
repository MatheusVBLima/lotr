import { Suspense } from "react"
import { apiClient } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ModernHeader } from "@/components/modern-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { translateApiContent } from '@/lib/api-translations'
import { getLocale, getTranslations } from 'next-intl/server'

// Pass t function as prop to use in server component
async function BooksOverview({ locale, t }: { locale: string, t: (key: string) => string }) {
  try {
    const booksResponse = await apiClient.getBooks()
    const books = booksResponse.docs

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <Card key={book._id} className="group hover:shadow-xl transition-all duration-300 border-primary/20 bg-card/50 backdrop-blur-sm hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="text-2xl font-serif text-primary group-hover:text-primary/80 transition-colors">{translateApiContent(book.name, locale)}</CardTitle>
              <CardDescription className="font-sans">
                {t('books.partOfTrilogy')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/30 transition-colors">Book</Badge>
              <div className="flex flex-col gap-2 pt-2">
                <Button asChild variant="outline" size="sm" className="w-full border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors">
                  <Link href={`/books/${book._id}`}>
                    {translateApiContent('viewDetails', locale)}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors">
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
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">
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
        <Card key={i} className="border-border/40">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-5 w-16" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default async function Home() {
  const locale = await getLocale()
  const t = await getTranslations()

  console.log(`🏠 [HOME PAGE] Rendering home page with locale: ${locale}`);
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      <ModernHeader />

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
        <div className="container mx-auto text-center space-y-8 relative z-10">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tight text-foreground drop-shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
              {t('home.title')}
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-sans leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
              {t('home.subtitle')}
            </p>
          </div>
          
          <div className="flex gap-4 justify-center flex-wrap animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            <Button asChild size="lg" className="h-12 px-8 text-lg font-serif shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
              <Link href="/movies">{t('home.moviesCard.title')}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-lg font-serif border-primary/30 hover:bg-primary/5 transition-all hover:-translate-y-0.5">
              <Link href="/characters">{t('home.charactersCard.title')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Books Section */}
      <section className="py-20 px-4 bg-muted/30 border-y border-border/50 relative">
        <div className="container mx-auto space-y-12 relative z-10">
          <div className="text-center space-y-4">
            <h3 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-foreground">The Books</h3>
            <div className="h-1 w-20 bg-primary/40 mx-auto rounded-full"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start your journey with the original trilogy. Explore the detailed chapters and lore.
            </p>
          </div>
          
          <Suspense fallback={<BooksOverviewSkeleton />}>
            <BooksOverview locale={locale} t={t} />
          </Suspense>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="text-center border-primary/10 bg-card/30 hover:bg-card/80 transition-colors group">
              <CardHeader>
                <CardTitle className="text-4xl font-serif font-bold text-primary group-hover:scale-110 transition-transform duration-300">3</CardTitle>
                <CardDescription className="font-medium">Books in the trilogy</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center border-primary/10 bg-card/30 hover:bg-card/80 transition-colors group">
              <CardHeader>
                <CardTitle className="text-4xl font-serif font-bold text-primary group-hover:scale-110 transition-transform duration-300">6</CardTitle>
                <CardDescription className="font-medium">Movies total</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center border-primary/10 bg-card/30 hover:bg-card/80 transition-colors group">
              <CardHeader>
                <CardTitle className="text-4xl font-serif font-bold text-primary group-hover:scale-110 transition-transform duration-300">900+</CardTitle>
                <CardDescription className="font-medium">Characters</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center border-primary/10 bg-card/30 hover:bg-card/80 transition-colors group">
              <CardHeader>
                <CardTitle className="text-4xl font-serif font-bold text-primary group-hover:scale-110 transition-transform duration-300">2000+</CardTitle>
                <CardDescription className="font-medium">Memorable quotes</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-12 px-4 bg-muted/20">
        <div className="container mx-auto text-center text-muted-foreground space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
             <span className="h-px w-12 bg-border"></span>
             <span className="text-primary text-xl">❦</span>
             <span className="h-px w-12 bg-border"></span>
          </div>
          <p className="font-serif italic">
            "Not all those who wander are lost."
          </p>
          <p className="text-sm mt-8">
            Built with love for Middle-earth • Data from{" "}
            <a 
              href="https://the-one-api.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline decoration-primary/50 underline-offset-4"
            >
              The One API
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}