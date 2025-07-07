'use client'

import { useState } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sports-tracker/ui'
import { Bell, Mail, MessageSquare, Smartphone, Trash2, Edit2, X, Check, Loader2 } from 'lucide-react'
import { useReminders } from '../../hooks/use-reminders'
import { cn } from '@sports-tracker/ui'
import type { Database } from '@sports-tracker/types'

type Reminder = Database['public']['Tables']['reminders']['Row'] & {
  event: Database['public']['Tables']['events']['Row'] & {
    sport: Database['public']['Tables']['sports']['Row']
  }
}

interface RemindersListProps {
  className?: string
}

export function RemindersList({ className }: RemindersListProps) {
  const { reminders, isLoading, updateReminder, deleteReminder, isUpdating, isDeleting } = useReminders()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<{
    type?: 'email' | 'push' | 'sms'
    minutesBefore?: number
  }>({})

  const upcomingReminders = reminders.filter(r => {
    const eventDate = new Date(r.event.start_time)
    return eventDate > new Date() && r.is_active
  })

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'email':
        return Mail
      case 'sms':
        return MessageSquare
      case 'push':
        return Smartphone
      default:
        return Bell
    }
  }

  const handleEdit = (reminder: Reminder) => {
    setEditingId(reminder.id)
    setEditValues({
      type: reminder.type,
      minutesBefore: reminder.minutes_before,
    })
  }

  const handleSave = async (reminderId: string) => {
    await updateReminder({
      id: reminderId,
      ...editValues,
    })
    setEditingId(null)
    setEditValues({})
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValues({})
  }

  const reminderTimes = [
    { value: 5, label: '5 minutes' },
    { value: 10, label: '10 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 1440, label: '1 day' },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (upcomingReminders.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="py-8">
          <div className="text-center space-y-2">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">No upcoming reminders</p>
            <p className="text-sm text-muted-foreground">
              Set reminders on event pages to get notified
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h3 className="text-lg font-medium">Upcoming Reminders</h3>
        <p className="text-sm text-muted-foreground">
          {upcomingReminders.length} active {upcomingReminders.length === 1 ? 'reminder' : 'reminders'}
        </p>
      </div>

      <div className="space-y-3">
        {upcomingReminders.map((reminder) => {
          const Icon = getReminderIcon(reminder.type)
          const eventDate = new Date(reminder.event.start_time)
          const isEditing = editingId === reminder.id

          return (
            <Card key={reminder.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{reminder.event.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        style={{ borderColor: reminder.event.sport.color, color: reminder.event.sport.color }}
                        className="text-xs"
                      >
                        {reminder.event.sport.name}
                      </Badge>
                      <span>•</span>
                      <span>{format(eventDate, 'PPP')}</span>
                      <span>•</span>
                      <span>{format(eventDate, 'p')}</span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!isEditing ? (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(reminder)}
                          disabled={isUpdating || isDeleting}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteReminder(reminder.id)}
                          disabled={isUpdating || isDeleting}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSave(reminder.id)}
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancel}
                          disabled={isUpdating}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!isEditing ? (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span>{reminder.type === 'sms' ? 'SMS' : reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)}</span>
                      <span>•</span>
                      <span>{reminder.minutes_before} minutes before</span>
                    </div>
                    <span className="text-muted-foreground">
                      in {formatDistanceToNow(eventDate)}
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      value={editValues.type || reminder.type}
                      onValueChange={(value) => setEditValues({ ...editValues, type: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>Email</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="push">
                          <div className="flex items-center space-x-2">
                            <Smartphone className="h-4 w-4" />
                            <span>Push</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="sms">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="h-4 w-4" />
                            <span>SMS</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={(editValues.minutesBefore || reminder.minutes_before).toString()}
                      onValueChange={(value) => setEditValues({ ...editValues, minutesBefore: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {reminderTimes.map((time) => (
                          <SelectItem key={time.value} value={time.value.toString()}>
                            {time.label} before
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}