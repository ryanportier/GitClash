import { createApiClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (code) {
    const supabase = createApiClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Use NEXT_PUBLIC_SITE_URL env var, fallback to request origin
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || url.origin
  return NextResponse.redirect(`${siteUrl}/summon`)
}
