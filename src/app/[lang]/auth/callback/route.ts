import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const redirectUrl = new URL(next, origin)
      redirectUrl.searchParams.set('verified', 'true')
      return NextResponse.redirect(redirectUrl.toString())
    }
    console.error('Exchange Code Error:', error.message)
  } else if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      const redirectUrl = new URL(next, origin)
      redirectUrl.searchParams.set('verified', 'true')
      return NextResponse.redirect(redirectUrl.toString())
    }
    console.error('Verify OTP Error:', error.message)
  } else {
    console.warn('No code or token_hash found in callback request')
  }

  // If we reach here, there was an error
  // Try to get lang from the URL if possible
  const url = new URL(request.url)
  const langMatch = url.pathname.match(/^\/([a-z]{2})\//)
  const lang = langMatch ? langMatch[1] : 'es'
  
  return NextResponse.redirect(`${origin}/${lang}/auth/auth-code-error`)
}
