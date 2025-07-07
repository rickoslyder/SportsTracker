import { Request, Response, NextFunction } from 'express'
import { createClient } from '@supabase/supabase-js'
import { logger } from '../utils/logger'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Extend Express Request type to include admin
declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: number
        email: string
        role: string
      }
    }
  }
}

export async function adminAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Check for admin API key in header (for server-to-server calls)
    const apiKey = req.headers['x-admin-api-key'] || req.headers['X-Admin-Api-Key']
    
    if (apiKey) {
      // Validate API key against database
      const { data: admin, error } = await supabase
        .from('admins')
        .select('id, email, role')
        .eq('api_token', apiKey)
        .eq('is_active', true)
        .single()
      
      if (!error && admin) {
        req.admin = {
          id: admin.id,
          email: admin.email,
          role: admin.role
        }
        return next()
      }
    }
    
    // Check for admin session/token in Authorization header
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' })
    }
    
    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    // For now, use a simple token validation
    // In production, this would validate JWT from Clerk or your auth provider
    const { data: admin, error } = await supabase
      .from('admins')
      .select('id, email, role, is_active')
      .eq('api_token', token)
      .eq('is_active', true)
      .single()
    
    if (error || !admin) {
      logger.warn(`Invalid admin token attempt: ${token.substring(0, 10)}...`)
      return res.status(401).json({ error: 'Unauthorized - Invalid token' })
    }
    
    // Attach admin to request
    req.admin = {
      id: admin.id,
      email: admin.email,
      role: admin.role
    }
    
    next()
  } catch (error) {
    logger.error('Admin auth middleware error:', error)
    res.status(500).json({ error: 'Authentication error' })
  }
}

// Middleware to check specific admin roles
export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ error: 'Forbidden - Insufficient permissions' })
    }
    
    next()
  }
}