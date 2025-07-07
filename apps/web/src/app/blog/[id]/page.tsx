import { Metadata } from 'next'
import { BlogPostHeader } from '../../../components/blog/blog-post-header'
import { BlogPostContent } from '../../../components/blog/blog-post-content'
import { BlogPostAuthor } from '../../../components/blog/blog-post-author'
import { RelatedPosts } from '../../../components/blog/related-posts'
import { NewsletterSignup } from '../../../components/blog/newsletter-signup'

export const metadata: Metadata = {
  title: 'Blog Post - Sports Event Tracker',
  description: 'Read our latest insights on sports event tracking.',
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-16">
      <article className="max-w-4xl mx-auto">
        <BlogPostHeader />
        <BlogPostContent />
        <BlogPostAuthor />
      </article>
      
      <div className="mt-16 max-w-6xl mx-auto">
        <RelatedPosts />
      </div>
      
      <NewsletterSignup />
    </div>
  )
}