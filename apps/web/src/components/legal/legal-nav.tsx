'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@sports-tracker/ui'
import { FileText, Shield, Cookie, Scale, Download } from 'lucide-react'

const legalPages = [
  {
    id: 'privacy',
    title: 'Privacy Policy',
    href: '/legal/privacy',
    icon: Shield
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    href: '/legal/terms',
    icon: FileText
  },
  {
    id: 'cookies',
    title: 'Cookie Policy',
    href: '/legal/cookies',
    icon: Cookie
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use',
    href: '/legal/acceptable-use',
    icon: Scale
  }
]

interface LegalNavProps {
  currentPage: string
}

export function LegalNav({ currentPage }: LegalNavProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-8 space-y-2"
    >
      <h3 className="font-semibold mb-4">Legal Documents</h3>
      
      {legalPages.map((page) => {
        const Icon = page.icon
        const isActive = currentPage === page.id
        
        return (
          <Link
            key={page.id}
            href={page.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
              isActive
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'hover:bg-muted'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="font-medium">{page.title}</span>
          </Link>
        )
      })}
      
      <div className="pt-6 border-t mt-6">
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-all w-full text-left">
          <Download className="h-4 w-4" />
          <span className="font-medium">Download All</span>
        </button>
      </div>
    </motion.nav>
  )
}