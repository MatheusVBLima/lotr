import { NextRequest, NextResponse } from 'next/server'

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  console.log(`🔍 [SIMPLE MIDDLEWARE] Processing: ${pathname}`)
  
  // Get locale from cookie or use default
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  const locale = cookieLocale || 'en'
  
  console.log(`🌐 [SIMPLE MIDDLEWARE] Using locale: ${locale} (from ${cookieLocale ? 'cookie' : 'default'})`)
  
  // Set the locale in the response headers for the app to use
  const response = NextResponse.next()
  response.headers.set('x-locale', locale)
  
  return response
}

export const config = {
  matcher: ['/', '/((?!api|_next|_vercel|.*\\..*).*)']
}