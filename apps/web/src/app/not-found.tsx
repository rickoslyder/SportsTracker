'use client'

import { motion } from 'framer-motion'
import { Button } from '@sports-tracker/ui'
import { GradientText } from '../components/common/gradient-text'
import { Home, Search, ArrowLeft, Flag } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  const popularPages = [
    { name: 'Events', href: '/events' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Help Center', href: '/help' }
  ]

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            <h1 className="text-[150px] md:text-[200px] font-bold leading-none">
              <GradientText gradient="sport">404</GradientText>
            </h1>
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                y: [0, -20, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Flag className="h-24 w-24 text-primary/20" />
            </motion.div>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Looks like this race went off track!
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            The page you're looking for doesn't exist. It might have been moved, 
            deleted, or you may have typed the URL incorrectly.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Button
            size="lg"
            onClick={() => router.back()}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button size="lg" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Home Page
            </Link>
          </Button>
        </motion.div>

        {/* Popular Pages */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-sm text-muted-foreground mb-4">
            Or try one of these popular pages:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {popularPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                {page.name}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Search Suggestion */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 p-6 rounded-lg bg-muted/50"
        >
          <Search className="h-8 w-8 text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Can't find what you're looking for? Try searching our help center or contact support.
          </p>
          <div className="flex gap-3 justify-center mt-4">
            <Link 
              href="/help" 
              className="text-sm text-primary hover:underline"
            >
              Help Center
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link 
              href="/help/contact" 
              className="text-sm text-primary hover:underline"
            >
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}