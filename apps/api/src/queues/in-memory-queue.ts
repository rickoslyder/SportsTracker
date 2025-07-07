// Simple in-memory queue implementation for development
import { logger } from '../utils/logger'

interface QueueJob<T = any> {
  id: string
  data: T
  attempts: number
  maxAttempts: number
  delay: number
  createdAt: Date
  processAt: Date
}

export class InMemoryQueue<T = any> {
  private jobs: Map<string, QueueJob<T>> = new Map()
  private timers: Map<string, NodeJS.Timeout> = new Map()
  private isProcessing: boolean = false
  private processor?: (data: T) => Promise<void>

  constructor(private name: string) {
    logger.info(`In-memory queue '${name}' initialized`)
  }

  async add(data: T, options: { delay?: number } = {}): Promise<void> {
    const job: QueueJob<T> = {
      id: `${Date.now()}-${Math.random()}`,
      data,
      attempts: 0,
      maxAttempts: 3,
      delay: options.delay || 0,
      createdAt: new Date(),
      processAt: new Date(Date.now() + (options.delay || 0))
    }

    this.jobs.set(job.id, job)

    if (job.delay > 0) {
      const timer = setTimeout(() => {
        this.processJob(job.id)
      }, job.delay)
      this.timers.set(job.id, timer)
    } else {
      await this.processJob(job.id)
    }
  }

  process(processor: (data: T) => Promise<void>): void {
    this.processor = processor
  }

  private async processJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId)
    if (!job || !this.processor) return

    try {
      job.attempts++
      await this.processor(job.data)
      
      // Job succeeded, remove it
      this.jobs.delete(jobId)
      const timer = this.timers.get(jobId)
      if (timer) {
        clearTimeout(timer)
        this.timers.delete(jobId)
      }
    } catch (error) {
      logger.error(`Job ${jobId} failed on attempt ${job.attempts}:`, error)
      
      if (job.attempts < job.maxAttempts) {
        // Retry with exponential backoff
        const retryDelay = Math.pow(2, job.attempts) * 1000
        const timer = setTimeout(() => {
          this.processJob(jobId)
        }, retryDelay)
        this.timers.set(jobId, timer)
      } else {
        // Max attempts reached, remove job
        logger.error(`Job ${jobId} failed after ${job.maxAttempts} attempts`)
        this.jobs.delete(jobId)
        const timer = this.timers.get(jobId)
        if (timer) {
          clearTimeout(timer)
          this.timers.delete(jobId)
        }
      }
    }
  }

  close(): void {
    // Clear all timers
    for (const timer of this.timers.values()) {
      clearTimeout(timer)
    }
    this.timers.clear()
    this.jobs.clear()
  }
}