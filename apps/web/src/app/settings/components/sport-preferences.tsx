'use client'

import { Checkbox, Label } from '@sports-tracker/ui'
import { useUserPreferences } from '../../../stores/user-preferences'
import { useSports } from '../../../hooks'
import { Loader2 } from 'lucide-react'

export function SportPreferences() {
  const { preferences, toggleSport } = useUserPreferences()
  const { data: sports, isLoading } = useSports()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Sport Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Select the sports you want to follow
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sports?.map((sport) => {
          const isSelected = preferences.selectedSports.includes(sport.slug)
          
          return (
            <div
              key={sport.id}
              className="flex items-start space-x-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors"
            >
              <Checkbox
                id={`sport-${sport.id}`}
                checked={isSelected}
                onCheckedChange={() => toggleSport(sport.slug)}
              />
              <div className="flex-1 space-y-1">
                <Label
                  htmlFor={`sport-${sport.id}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {sport.name}
                </Label>
                {sport.description && (
                  <p className="text-xs text-muted-foreground">
                    {sport.description}
                  </p>
                )}
              </div>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: sport.color }}
              />
            </div>
          )
        })}
      </div>
      
      {sports && sports.length > 0 && preferences.selectedSports.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Select at least one sport to see events
        </p>
      )}
    </div>
  )
}