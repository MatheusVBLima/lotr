import { Suspense } from "react"
import { notFound } from "next/navigation"
import { apiClient } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ModernHeader } from "@/components/modern-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Book } from "lucide-react"

interface BookPageProps {
  params: Promise<{ id: string }>
}

async function BookDetails({ bookId }: { bookId: string }) {
  try {
    const book = await apiClient.getBook(bookId)
    
    if (!book) {
      notFound()
    }

    return (
      <div className="space-y-8">
        <Card>
          <CardHeader className="text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Book className="text-primary" size={48} />
            </div>
            <CardTitle className="text-4xl">{book.name}</CardTitle>
            <CardDescription className="text-xl">
              Part of The Lord of the Rings trilogy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                J.R.R. Tolkien
              </Badge>
            </div>

            <div className="prose prose-lg max-w-none text-center">
              <p className="text-muted-foreground">
                This volume is part of the epic high-fantasy trilogy that has captivated readers 
                for generations. Each book in the series chronicles different aspects of the 
                journey through Middle-earth, following the Fellowship&apos;s quest to destroy the One Ring.
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href={`/books/${book._id}/chapters`}>
                  Explore Chapters
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/characters">
                  Meet the Characters
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Book Context */}
        <Card>
          <CardHeader>
            <CardTitle>About This Volume</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p>
              {book.name} is one of the three volumes that make up The Lord of the Rings, 
              J.R.R. Tolkien&apos;s legendary fantasy epic. Originally published in the 1950s, 
              this work has become the foundation of modern fantasy literature.
            </p>
            <p>
              The story takes place in Middle-earth, a fictional world filled with diverse 
              races including Hobbits, Elves, Dwarves, and Men, all united in their struggle 
              against the dark forces of Sauron.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  } catch {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            Failed to load book details. Please try again later.
          </p>
        </CardContent>
      </Card>
    )
  }
}

function BookDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="text-center">
          <Skeleton className="w-24 h-24 rounded-lg mx-auto mb-6" />
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
          </div>
          <div className="flex gap-4 justify-center">
            <Skeleton className="h-12 w-36" />
            <Skeleton className="h-12 w-40" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    </div>
  )
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Button asChild variant="outline">
          <Link href="/books" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Books
          </Link>
        </Button>

        <Suspense fallback={<BookDetailsSkeleton />}>
          <BookDetails bookId={id} />
        </Suspense>
      </main>
    </div>
  )
}