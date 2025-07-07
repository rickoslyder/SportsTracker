'use client'

import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from '@sports-tracker/ui'
import { useUserPreferences } from '../../../stores/user-preferences'
import { useTheme } from '../../../hooks/use-theme'
import { Moon, Sun, Monitor } from 'lucide-react'

export function AppearanceSettings() {
  const { preferences, setPreferences, setNoSpoilerMode } = useUserPreferences()
  const { theme, setTheme } = useTheme()

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize how the app looks and feels
        </p>
      </div>
      
      <div className="space-y-4">
        {/* Theme Selection */}
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select value={theme} onValueChange={(value: any) => setTheme(value)}>
            <SelectTrigger id="theme">
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              {themeOptions.map((option) => {
                const Icon = option.icon
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Choose your preferred color scheme
          </p>
        </div>

        {/* No Spoiler Mode */}
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="no-spoiler">No-Spoiler Mode</Label>
            <p className="text-xs text-muted-foreground">
              Hide event results until you choose to reveal them
            </p>
          </div>
          <Switch
            id="no-spoiler"
            checked={preferences.noSpoilerMode}
            onCheckedChange={setNoSpoilerMode}
          />
        </div>

        {/* Theme Preview */}
        <div className="rounded-lg border p-4 space-y-3">
          <p className="text-sm font-medium">Preview</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-primary" />
              <span className="text-sm">Primary Color</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-secondary" />
              <span className="text-sm">Secondary Color</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-accent" />
              <span className="text-sm">Accent Color</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-muted" />
              <span className="text-sm">Muted Color</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}