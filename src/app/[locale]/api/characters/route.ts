import { NextRequest, NextResponse } from 'next/server'
import { apiClient } from '@/lib/api'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  const limit = parseInt(searchParams.get('limit') || '12')
  const page = parseInt(searchParams.get('page') || '1')
  const name = searchParams.get('name')
  const race = searchParams.get('race')
  const gender = searchParams.get('gender')
  
  try {
    const filters: Record<string, string> = {}
    if (name) filters.name = name
    if (race) filters.race = race
    if (gender && gender !== 'all') filters.gender = gender
    
    const data = await apiClient.getCharacters(filters, { page, limit })
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Characters API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch characters' },
      { status: 500 }
    )
  }
}