'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { ClerkProvider } from '@clerk/nextjs'
import { useState } from 'react'
import { ThemeProvider } from '../components/providers/theme-provider'
import { Toaster } from 'sonner'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    capture_pageview: false // Disable automatic pageview capture, handled manually
  })
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <ClerkProvider>
      <PostHogProvider client={posthog}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            {children}
            <Toaster richColors position="top-right" />
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
          </ThemeProvider>
        </QueryClientProvider>
      </PostHogProvider>
    </ClerkProvider>
  )
}