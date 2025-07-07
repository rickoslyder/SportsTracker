'use server'

import { createClient } from '../../lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { Database } from '@sports-tracker/types'
import { revalidatePath } from 'next/cache'

type UserConfig = Database['public']['Tables']['user_configs']['Row']

export async function getUserConfig() {
  const { userId } = await auth()
  if (!userId) return null
  
  const supabase = await createClient()
  
  // Try to get existing config
  const { data: existingConfig, error: fetchError } = await supabase
    .from('user_configs')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (existingConfig) return existingConfig
  
  // Create new config if none exists
  if (fetchError?.code === 'PGRST116') {
    const { data: newConfig, error: createError } = await supabase
      .from('user_configs')
      .insert({
        user_id: userId,
        preferences: {
          selectedSports: [],
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          noSpoilerMode: false,
          reminderDefaults: {
            minutesBefore: 30,
            type: 'email',
          },
          theme: 'system',
        },
        sync_enabled: true,
        subscription_tier: 'free',
      })
      .select()
      .single()
    
    if (createError) throw createError
    return newConfig
  }
  
  if (fetchError) throw fetchError
  return null
}

export async function updateUserConfig(updates: Partial<UserConfig>) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  
  const supabase = await createClient()
  
  // Get current config
  const { data: currentConfig, error: fetchError } = await supabase
    .from('user_configs')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (fetchError) throw fetchError
  if (!currentConfig) throw new Error('User config not found')
  
  // Update config
  const { data, error } = await supabase
    .from('user_configs')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', currentConfig.id)
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/settings')
  revalidatePath('/dashboard')
  
  return data
}

export async function updateUserPreferences(preferences: any) {
  const userConfig = await getUserConfig()
  if (!userConfig) throw new Error('User config not found')
  
  return updateUserConfig({
    preferences: {
      ...(userConfig.preferences as any),
      ...preferences,
    },
  })
}

export async function updateSubscription(tier: 'free' | 'premium', stripeCustomerId?: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  
  const supabase = await createClient()
  
  const updates: Partial<UserConfig> = {
    subscription_tier: tier,
    subscription_end_date: tier === 'premium' 
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      : null,
  }
  
  if (stripeCustomerId) {
    updates.stripe_customer_id = stripeCustomerId
  }
  
  return updateUserConfig(updates)
}