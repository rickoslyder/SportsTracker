'use client'

import { useState } from 'react'
import TimezoneSelect, { type ITimezone } from 'react-timezone-select'
import { Label } from '@sports-tracker/ui'
import { useUserPreferences } from '../../../stores/user-preferences'

export function TimezoneSettings() {
  const { preferences, setTimezone } = useUserPreferences()
  const [selectedTimezone, setSelectedTimezone] = useState<ITimezone>({
    value: preferences.timezone,
    label: preferences.timezone.replace(/_/g, ' '),
  })

  const handleTimezoneChange = (timezone: ITimezone) => {
    setSelectedTimezone(timezone)
    setTimezone(timezone.value)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Timezone</h3>
        <p className="text-sm text-muted-foreground">
          Select your timezone for displaying event times
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="timezone">Timezone</Label>
        <TimezoneSelect
          value={selectedTimezone}
          onChange={handleTimezoneChange}
          classNames={{
            control: () => 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            menu: () => 'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
            menuList: () => 'p-1',
            option: (state: any) => `relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none ${state.isFocused ? 'bg-accent text-accent-foreground' : ''} ${state.isDisabled ? 'pointer-events-none opacity-50' : ''}`,
            singleValue: () => 'text-sm',
            input: () => 'text-sm',
          }}
        />
        <p className="text-xs text-muted-foreground">
          Current time in {selectedTimezone.value}: {new Date().toLocaleTimeString('en-US', { timeZone: selectedTimezone.value, hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}