import { NextResponse } from 'next/server'

// Lê as env vars em tempo de requisição (senão o Next cacheia null do build)
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  return NextResponse.json({
    basico:  process.env.KIWIFY_LINK_BASICO  || null,
    premium: process.env.KIWIFY_LINK_PREMIUM || null,
    pro:     process.env.KIWIFY_LINK_PRO     || null,
  })
}
