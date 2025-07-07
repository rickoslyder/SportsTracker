'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createReminder, getReminders, updateReminder, deleteReminder } from '../app/actions/reminders'
import { useUserConfig } from './use-user-config'
import { toast } from 'sonner'

export function useReminders() {
  const { data: userConfig } = useUserConfig()
  const queryClient = useQueryClient()

  const remindersQuery = useQuery({
    queryKey: ['reminders', userConfig?.id],
    queryFn: async () => {
      if (!userConfig?.id) return []
      return getReminders(userConfig.id)
    },
    enabled: !!userConfig?.id,
  })

  const createReminderMutation = useMutation({
    mutationFn: createReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
      toast.success('Reminder created successfully')
    },
    onError: (error) => {
      toast.error('Failed to create reminder')
      console.error('Create reminder error:', error)
    },
  })

  const updateReminderMutation = useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Parameters<typeof updateReminder>[1]) => 
      updateReminder(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
      toast.success('Reminder updated successfully')
    },
    onError: (error) => {
      toast.error('Failed to update reminder')
      console.error('Update reminder error:', error)
    },
  })

  const deleteReminderMutation = useMutation({
    mutationFn: deleteReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
      toast.success('Reminder deleted successfully')
    },
    onError: (error) => {
      toast.error('Failed to delete reminder')
      console.error('Delete reminder error:', error)
    },
  })

  return {
    reminders: remindersQuery.data || [],
    isLoading: remindersQuery.isLoading,
    error: remindersQuery.error,
    createReminder: createReminderMutation.mutate,
    updateReminder: updateReminderMutation.mutate,
    deleteReminder: deleteReminderMutation.mutate,
    isCreating: createReminderMutation.isPending,
    isUpdating: updateReminderMutation.isPending,
    isDeleting: deleteReminderMutation.isPending,
  }
}