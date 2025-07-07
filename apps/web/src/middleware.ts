import { authMiddleware } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

export default authMiddleware({
  publicRoutes: [
    '/',
    '/events(.*)',
    '/api/events(.*)',
    '/api/sports(.*)',
    '/api/webhooks(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
  ],
  async afterAuth(auth, req: NextRequest) {
    // Update Supabase session
    return await updateSession(req)
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}