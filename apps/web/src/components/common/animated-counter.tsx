'use client'

import { useEffect, useState } from 'react'
import { cn } from '@sports-tracker/ui'

interface AnimatedCounterProps {
  end: number
  duration?: number
  className?: string
  suffix?: string
}

export function AnimatedCounter({ end, duration = 2000, className, suffix = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration])

  return (
    <span className={cn('tabular-nums', className)}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}