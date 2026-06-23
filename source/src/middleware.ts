import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Páginas de funil (tráfego de anúncio, deslogado) — precisam ser públicas
const PUBLIC_ROUTES = ['/login', '/criar-senha', '/acesso-negado', '/api/', '/quiz', '/landing', '/upsell']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (PUBLIC_ROUTES.some(r => pathname.startsWith(r))) return NextResponse.next()

  const response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cs: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cs.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', request.url))

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)'],
}
