import { apiClient } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ModernHeader } from "@/components/modern-header"
import { BooksListCached } from "@/components/books-list-cached"

// Force dynamic rendering for consistency
export const dynamic = 'force-dynamic'

export default async function BooksPage() {
  try {
    const initialBooks = await apiClient.getBooks({ limit: 20 })

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold tracking-tight">The Lord of the Rings</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore J.R.R. Tolkien&apos;s masterpiece trilogy that defined modern fantasy literature. 
            Each book chronicles the epic journey of the Fellowship and their quest to destroy the One Ring.
          </p>
        </div>

        <BooksListCached initialData={initialBooks} />

        {/* Additional Info */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle>About The Lord of the Rings</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              The Lord of the Rings is an epic high-fantasy novel written by English author and scholar 
              J. R. R. Tolkien. Set in Middle-earth, the world at some distant time in the past, the story 
              began as a sequel to Tolkien&apos;s 1937 children&apos;s book The Hobbit, but eventually developed into 
              a much larger work.
            </p>
            <p>
              Written in stages between 1937 and 1949, The Lord of the Rings is one of the best-selling 
              novels ever written, with over 150 million copies sold. The title refers to the story&apos;s main 
              antagonist, the Dark Lord Sauron, who created the One Ring to control the other Rings of Power.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
  } catch (error) {
    console.error('❌ Error fetching books:', error)
    return (
      <div className="min-h-screen bg-background">
        <ModernHeader />
        <main className="container mx-auto px-4 py-8 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">The Lord of the Rings</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore J.R.R. Tolkien&apos;s masterpiece trilogy that defined modern fantasy literature.
              Each book chronicles the epic journey of the Fellowship and their quest to destroy the One Ring.
            </p>
            <p className="text-sm text-red-500 mt-4">
              Error loading books. Please try again later.
            </p>
          </div>
          <BooksListCached initialData={{ docs: [], total: 0, limit: 20, page: 1, pages: 0 }} />
        </main>
      </div>
    )
  }
}