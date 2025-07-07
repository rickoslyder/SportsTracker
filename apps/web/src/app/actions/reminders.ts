'use server'

import { createClient } from '../../lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { Database } from '@sports-tracker/types'
import { revalidatePath } from 'next/cache'

type Reminder = Database['public']['Tables']['reminders']['Row']
type ReminderWithEvent = Reminder & {
  event: Database['public']['Tables']['events']['Row'] & {
    sport: Database['public']['Tables']['sports']['Row']
  }
}

export async function createReminder(data: {
  eventId: string
  type: 'email' | 'push' | 'sms'
  minutesBefore: number
  userConfigId: string
}) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  
  const supabase = await createClient()
  
  // Get event details to calculate scheduled time
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('start_time')
    .eq('id', data.eventId)
    .single()
  
  if (eventError || !event) throw new Error('Event not found')
  
  const scheduledFor = new Date(event.start_time)
  scheduledFor.setMinutes(scheduledFor.getMinutes() - data.minutesBefore)
  
  const { data: reminder, error } = await supabase
    .from('reminders')
    .insert({
      event_id: data.eventId,
      user_config_id: data.userConfigId,
      type: data.type,
      minutes_before: data.minutesBefore,
      scheduled_for: scheduledFor.toISOString(),
      status: 'pending',
      is_active: true,
    })
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/dashboard')
  revalidatePath('/reminders')
  
  return reminder
}

export async function getReminders(userConfigId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('reminders')
    .select(`
      *,
      event:events!inner(
        *,
        sport:sports!inner(*)
      )
    `)
    .eq('user_config_id', userConfigId)
    .eq('is_active', true)
    .order('scheduled_for', { ascending: true })
  
  if (error) throw error
  
  return data as ReminderWithEvent[]
}

export async function updateReminder(reminderId: string, updates: {
  type?: 'email' | 'push' | 'sms'
  minutes_before?: number
  is_active?: boolean
}) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  
  const supabase = await createClient()
  
  // If minutes_before is updated, recalculate scheduled_for
  if (updates.minutes_before) {
    const { data: reminder, error: fetchError } = await supabase
      .from('reminders')
      .select('event:events!inner(start_time)')
      .eq('id', reminderId)
      .single()
    
    if (fetchError || !reminder) throw new Error('Reminder not found')
    
    const scheduledFor = new Date(reminder.event.start_time)
    scheduledFor.setMinutes(scheduledFor.getMinutes() - updates.minutes_before)
    
    updates = {
      ...updates,
      scheduled_for: scheduledFor.toISOString(),
    } as any
  }
  
  const { data, error } = await supabase
    .from('reminders')
    .update(updates)
    .eq('id', reminderId)
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/dashboard')
  revalidatePath('/reminders')
  
  return data
}

export async function deleteReminder(reminderId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('reminders')
    .update({ is_active: false })
    .eq('id', reminderId)
  
  if (error) throw error
  
  revalidatePath('/dashboard')
  revalidatePath('/reminders')
  
  return { success: true }
}