import { NextRequest, NextResponse } from 'next/server'
import { apiClient } from '@/lib/api'
import { enrichQuotes } from '@/lib/quote-enricher'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const limit = parseInt(searchParams.get('limit') || '20')
  const page = parseInt(searchParams.get('page') || '1')
  const dialog = searchParams.get('dialog')
  
  try {
    const filters: Record<string, string> = {}
    if (dialog) filters.dialog = dialog
    
    const data = await apiClient.getQuotes(filters, { page, limit })
    
    // Enrich quotes with character and movie names
    const enrichedQuotes = await enrichQuotes(data.docs)
    
    return NextResponse.json({
      ...data,
      docs: enrichedQuotes
    })
    
  } catch (error) {
    console.error('Quotes API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    )
  }
}