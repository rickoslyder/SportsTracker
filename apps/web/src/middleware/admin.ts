import { auth } from '@clerk/nextjs'
import { createClient } from '../lib/supabase/server'
import { redirect } from 'next/navigation'

export async function requireAdmin() {
  const { userId } = auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const supabase = createClient()
  
  // Check if user has admin role
  const { data: userRole, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single()

  if (error || !userRole || userRole.role !== 'admin') {
    redirect('/unauthorized')
  }

  return { userId, isAdmin: true }
}