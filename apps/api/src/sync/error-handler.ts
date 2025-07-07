import { logger } from '../utils/logger'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface SyncError {
  sport_id: number
  sport_name: string
  error_type: 'network' | 'api' | 'validation' | 'database' | 'unknown'
  error_message: string
  error_details?: any
  endpoint?: string
  retry_count: number
  max_retries: number
}

export class SyncErrorHandler {
  private static readonly MAX_RETRIES = 3
  private static readonly RETRY_DELAYS = [1000, 5000, 15000] // 1s, 5s, 15s
  private static errorCounts = new Map<number, number>()
  private static readonly ERROR_THRESHOLD = 10 // Disable after 10 consecutive errors
  
  static async handleError(error: Error, context: {
    sportId: number
    sportName: string
    endpoint?: string
    retryCount?: number
  }): Promise<boolean> {
    const errorType = this.categorizeError(error)
    const retryCount = context.retryCount || 0
    
    // Log to database
    await this.logError({
      sport_id: context.sportId,
      sport_name: context.sportName,
      error_type: errorType,
      error_message: error.message,
      error_details: error.stack,
      endpoint: context.endpoint,
      retry_count: retryCount,
      max_retries: this.MAX_RETRIES
    })
    
    // Update error count
    const currentCount = this.errorCounts.get(context.sportId) || 0
    this.errorCounts.set(context.sportId, currentCount + 1)
    
    // Check if we should disable sync
    if (currentCount + 1 >= this.ERROR_THRESHOLD) {
      logger.error(`Disabling sync for ${context.sportName} after ${currentCount + 1} consecutive errors`)
      await this.disableSync(context.sportId, context.sportName)
      return false // Don't retry
    }
    
    // Determine if we should retry
    if (errorType === 'network' && retryCount < this.MAX_RETRIES) {
      return true // Should retry
    }
    
    return false // Don't retry
  }
  
  static async retryWithBackoff<T>(
    fn: () => Promise<T>,
    context: {
      sportId: number
      sportName: string
      endpoint?: string
    }
  ): Promise<T> {
    let lastError: Error | null = null
    
    for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const result = await fn()
        
        // Reset error count on success
        this.errorCounts.set(context.sportId, 0)
        
        return result
      } catch (error) {
        lastError = error as Error
        
        const shouldRetry = await this.handleError(lastError, {
          ...context,
          retryCount: attempt
        })
        
        if (!shouldRetry || attempt === this.MAX_RETRIES) {
          break
        }
        
        // Wait before retrying
        const delay = this.RETRY_DELAYS[attempt] || 30000
        logger.info(`Retrying ${context.sportName} sync in ${delay}ms (attempt ${attempt + 1}/${this.MAX_RETRIES})`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    throw lastError || new Error('Unknown error in retry logic')
  }
  
  private static categorizeError(error: Error): SyncError['error_type'] {
    const message = error.message.toLowerCase()
    
    if (message.includes('enotfound') || 
        message.includes('econnrefused') || 
        message.includes('timeout') ||
        message.includes('network')) {
      return 'network'
    }
    
    if (message.includes('401') || 
        message.includes('403') || 
        message.includes('rate limit') ||
        message.includes('api')) {
      return 'api'
    }
    
    if (message.includes('validation') || 
        message.includes('invalid')) {
      return 'validation'
    }
    
    if (message.includes('database') || 
        message.includes('supabase')) {
      return 'database'
    }
    
    return 'unknown'
  }
  
  private static async logError(error: SyncError) {
    try {
      await supabase
        .from('sync_errors')
        .insert({
          sport_id: error.sport_id,
          sport_name: error.sport_name,
          error_type: error.error_type,
          error_message: error.error_message,
          error_details: error.error_details,
          endpoint: error.endpoint,
          retry_count: error.retry_count,
          max_retries: error.max_retries,
          created_at: new Date().toISOString()
        })
    } catch (dbError) {
      logger.error('Failed to log sync error to database:', dbError)
    }
  }
  
  private static async disableSync(sportId: number, sportName: string) {
    try {
      // In a real implementation, this would update a config in the database
      // For now, just log it
      logger.error(`SYNC DISABLED for ${sportName} (ID: ${sportId}) due to repeated errors`)
      
      // Could also send an alert to admins
      // await sendAdminAlert(`Sync disabled for ${sportName}`)
    } catch (error) {
      logger.error('Failed to disable sync:', error)
    }
  }
  
  static resetErrorCount(sportId: number) {
    this.errorCounts.set(sportId, 0)
  }
  
  static getErrorCount(sportId: number): number {
    return this.errorCounts.get(sportId) || 0
  }
}