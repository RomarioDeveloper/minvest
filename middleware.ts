import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['ru', 'kk']
const defaultLocale = 'ru'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignore public files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') || 
    pathname.startsWith('/hero-') ||
    pathname.startsWith('/render-') ||
    pathname.startsWith('/photos') ||
    pathname.startsWith('/video')
  ) {
    return
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Постоянный редирект: иначе Google видит / и /ru как дубли без каноникала
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.redirect(request.nextUrl, 308)
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}
