import { cn } from '@sports-tracker/ui'

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  gradient?: 'primary' | 'sport' | 'vibrant'
}

export function GradientText({ children, className, gradient = 'primary' }: GradientTextProps) {
  const gradients = {
    primary: 'from-primary to-primary/60',
    sport: 'from-f1-red via-motogp-red to-ufc-gold',
    vibrant: 'from-blue-600 via-purple-600 to-pink-600'
  }

  return (
    <span className={cn(
      'bg-gradient-to-r bg-clip-text text-transparent',
      gradients[gradient],
      className
    )}>
      {children}
    </span>
  )
}