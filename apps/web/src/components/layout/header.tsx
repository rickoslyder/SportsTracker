'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button, Toggle } from '@sports-tracker/ui'
import { cn } from '@sports-tracker/ui'
import { Eye, EyeOff } from 'lucide-react'
import { useUserPreferences } from '../../stores/user-preferences'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Events', href: '/events' },
  { name: 'Reminders', href: '/reminders', requiresAuth: true },
  { name: 'Dashboard', href: '/dashboard', requiresAuth: true },
  { name: 'Settings', href: '/settings', requiresAuth: true },
]

export function Header() {
  const pathname = usePathname()
  const { preferences, setPreferences } = useUserPreferences()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center">
        <div className="mr-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Sports Tracker</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-6">
            {navigation.map((item) => {
              if (item.requiresAuth) {
                return (
                  <SignedIn key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'text-sm font-medium transition-colors hover:text-primary',
                        pathname === item.href
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      {item.name}
                    </Link>
                  </SignedIn>
                )
              }
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-primary',
                    pathname === item.href
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="no-spoiler-toggle" className="flex items-center space-x-2 cursor-pointer">
                {preferences.noSpoilerMode ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground">
                  {preferences.noSpoilerMode ? 'Spoilers Hidden' : 'Spoilers Shown'}
                </span>
              </label>
              <Toggle
                id="no-spoiler-toggle"
                checked={preferences.noSpoilerMode}
                onCheckedChange={(checked) => setPreferences({ noSpoilerMode: checked })}
                aria-label="Toggle no-spoiler mode"
              />
            </div>
            
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>
    </header>
  )
}