import { Metadata } from 'next'
import { BlogHero } from '../../components/blog/blog-hero'
import { BlogGrid } from '../../components/blog/blog-grid'
import { BlogCategories } from '../../components/blog/blog-categories'
import { NewsletterSignup } from '../../components/blog/newsletter-signup'

export const metadata: Metadata = {
  title: 'Blog - Sports Event Tracker',
  description: 'Tips, updates, and insights to help you never miss your favorite sports events.',
}

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <BlogHero />
      <BlogCategories />
      <BlogGrid />
      <NewsletterSignup />
    </div>
  )
}