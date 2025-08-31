'use client'

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Book } from "lucide-react"
import type { Book as BookType, ApiResponse } from "@/lib/types"

interface BooksListCachedProps {
  initialData?: ApiResponse<BookType>
}

export function BooksListCached({ initialData }: BooksListCachedProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['books'],
    queryFn: () => apiClient.getBooks({ limit: 20 }),
    initialData,
    staleTime: 10 * 60 * 1000, // 10 minutes (books change less)
    gcTime: 30 * 60 * 1000, // 30 minutes
  })

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Failed to load books. Please try again later.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return <BooksListSkeleton />
  }

  const books = data?.docs || []

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {books.map((book: BookType) => (
        <Card key={book._id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Book className="text-primary" size={32} />
            </div>
            <CardTitle className="text-2xl">{book.name}</CardTitle>
            <CardDescription className="text-base">
              Part of The Lord of the Rings trilogy by J.R.R. Tolkien
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <Badge variant="secondary" className="text-base px-3 py-1">
                Classic Literature
              </Badge>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>
                One of the foundational works of modern fantasy literature, 
                chronicling the epic journey through Middle-earth.
              </p>
            </div>

            <div className="flex gap-2 justify-center">
              <Button asChild variant="outline">
                <Link href={`/books/${book._id}`}>
                  Book Details
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/books/${book._id}/chapters`}>
                  View Chapters
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function BooksListSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader className="text-center">
            <Skeleton className="w-16 h-16 rounded-lg mx-auto mb-4" />
            <Skeleton className="h-7 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-full mx-auto" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
            <div className="flex gap-2 justify-center">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-28" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}