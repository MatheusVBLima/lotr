'use client'

import { useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { useEffect } from 'react'

export function PrefetchProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()

  useEffect(() => {
    // Prefetch commonly accessed data
    queryClient.prefetchQuery({
      queryKey: ['movies'],
      queryFn: () => apiClient.getMovies({}, { limit: 20 }),
      staleTime: 5 * 60 * 1000, // 5 minutes
    })

    queryClient.prefetchQuery({
      queryKey: ['books'],
      queryFn: () => apiClient.getBooks({ limit: 20 }),
      staleTime: 10 * 60 * 1000, // 10 minutes (books change less)
    })
  }, [queryClient])

  return <>{children}</>
}