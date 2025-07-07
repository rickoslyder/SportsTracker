'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger, Separator } from '@sports-tracker/ui'
import { SportPreferences } from './components/sport-preferences'
import { AppearanceSettings } from './components/appearance-settings'
import { NotificationSettings } from './components/notification-settings'
import { TimezoneSettings } from './components/timezone-select'
import { AccountSettings } from './components/account-settings'
import { useTheme } from '../../hooks/use-theme'

export default function SettingsPage() {
  // Initialize theme on mount
  useTheme()

  return (
    <Tabs defaultValue="sports" className="space-y-6">
      <TabsList className="grid grid-cols-2 lg:grid-cols-5 w-full">
        <TabsTrigger value="sports">Sports</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="timezone">Timezone</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>

      <TabsContent value="sports" className="space-y-6">
        <SportPreferences />
      </TabsContent>

      <TabsContent value="appearance" className="space-y-6">
        <AppearanceSettings />
      </TabsContent>

      <TabsContent value="timezone" className="space-y-6">
        <TimezoneSettings />
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <NotificationSettings />
      </TabsContent>

      <TabsContent value="account" className="space-y-6">
        <AccountSettings />
      </TabsContent>
    </Tabs>
  )
}