import { Suspense } from "react"
import { notFound } from "next/navigation"
import { apiClient } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ModernHeader } from "@/components/modern-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"

interface BookChaptersPageProps {
  params: Promise<{ id: string }>
}

async function BookChapters({ bookId }: { bookId: string }) {
  try {
    const [book, chaptersResponse] = await Promise.all([
      apiClient.getBook(bookId),
      apiClient.getBookChapters(bookId, { limit: 50 })
    ])
    
    if (!book) {
      notFound()
    }

    const chapters = chaptersResponse.docs

    return (
      <div className="space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">{book.name}</CardTitle>
            <CardDescription className="text-lg">
              {chapters.length} chapters available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                J.R.R. Tolkien
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {chapters.map((chapter, index) => (
            <Card key={chapter._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="text-primary" size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Chapter {index + 1}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      {chapter.chapterName}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {chapters.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="mx-auto mb-4 text-muted-foreground" size={48} />
              <h3 className="text-lg font-semibold mb-2">No Chapters Available</h3>
              <p className="text-muted-foreground">
                Chapter information is not available for this book in the API.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    )
  } catch {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            Failed to load chapters. Please try again later.
          </p>
        </CardContent>
      </Card>
    )
  }
}

function BookChaptersSkeleton() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="text-center">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-1/2 mx-auto" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Skeleton className="h-8 w-32" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-start gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default async function BookChaptersPage({ params }: BookChaptersPageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <Button asChild variant="outline">
          <Link href={`/books/${id}`} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Book
          </Link>
        </Button>

        <Suspense fallback={<BookChaptersSkeleton />}>
          <BookChapters bookId={id} />
        </Suspense>
      </main>
    </div>
  )
}