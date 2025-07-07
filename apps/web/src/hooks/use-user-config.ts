'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '../lib/supabase/client'
import { useUser } from '@clerk/nextjs'
import { useUserPreferences } from '../stores/user-preferences'
import { Database } from '@sports-tracker/types'

type UserConfig = Database['public']['Tables']['user_configs']['Row']

export function useUserConfig() {
  const { user } = useUser()
  const queryClient = useQueryClient()
  const { preferences, setPreferences } = useUserPreferences()
  
  // Get or create user config
  const { data: userConfig, isLoading } = useQuery({
    queryKey: ['user-config', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        // Return local preferences for anonymous users
        return null
      }
      
      const supabase = createClient()
      
      // Try to get existing config
      const { data: existingConfig, error: fetchError } = await supabase
        .from('user_configs')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      if (existingConfig) return existingConfig
      
      // Create new config if none exists
      if (fetchError?.code === 'PGRST116') {
        const { data: newConfig, error: createError } = await supabase
          .from('user_configs')
          .insert({
            user_id: user.id,
            preferences: preferences,
            sync_enabled: true,
          })
          .select()
          .single()
        
        if (createError) throw createError
        return newConfig
      }
      
      if (fetchError) throw fetchError
      return null
    },
    enabled: !!user,
  })
  
  // Update user config
  const updateConfig = useMutation({
    mutationFn: async (updates: Partial<UserConfig>) => {
      if (!user?.id || !userConfig) {
        // Update local preferences for anonymous users
        if (updates.preferences) {
          setPreferences(updates.preferences as any)
        }
        return null
      }
      
      const supabase = createClient()
      const { data, error } = await supabase
        .from('user_configs')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userConfig.id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['user-config', user?.id] })
        // Sync local preferences with server
        setPreferences(data.preferences as any)
      }
    },
  })
  
  // Sync local preferences with server config
  const syncPreferences = useMutation({
    mutationFn: async () => {
      if (!userConfig) return null
      
      return updateConfig.mutate({
        preferences: preferences as any,
      })
    },
  })
  
  return {
    userConfig,
    isLoading,
    updateConfig: updateConfig.mutate,
    syncPreferences: syncPreferences.mutate,
    isUpdating: updateConfig.isPending || syncPreferences.isPending,
  }
}