'use client'

import { RemindersList } from '../../components/reminders/reminders-list'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sports-tracker/ui'
import { useUser } from '@clerk/nextjs'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@sports-tracker/ui'

export default function RemindersPage() {
  const { isSignedIn } = useUser()

  if (!isSignedIn) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Reminders</h1>
          <p className="text-muted-foreground">
            Manage your event reminders
          </p>
        </div>
        
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground" />
              <h2 className="text-xl font-semibold">Sign in to set reminders</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Create an account or sign in to set reminders for upcoming events and never miss your favorite sports moments.
              </p>
              <Button asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reminders</h1>
        <p className="text-muted-foreground">
          Manage your event reminders
        </p>
      </div>
      
      <RemindersList />
    </div>
  )
}