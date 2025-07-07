import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface UserPreferences {
  selectedSports: string[]
  timezone: string
  noSpoilerMode: boolean
  reminderDefaults: {
    minutesBefore: number
    type: 'email' | 'push' | 'sms'
  }
  theme: 'light' | 'dark' | 'system'
  syncEnabled: boolean
}

interface UserPreferencesStore {
  preferences: UserPreferences
  setPreferences: (preferences: Partial<UserPreferences>) => void
  toggleSport: (sportSlug: string) => void
  setTimezone: (timezone: string) => void
  setNoSpoilerMode: (enabled: boolean) => void
  setTheme: (theme: UserPreferences['theme']) => void
  reset: () => void
}

const defaultPreferences: UserPreferences = {
  selectedSports: [],
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  noSpoilerMode: false,
  reminderDefaults: {
    minutesBefore: 30,
    type: 'email',
  },
  theme: 'system',
  syncEnabled: false,
}

export const useUserPreferences = create<UserPreferencesStore>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      
      setPreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),
      
      toggleSport: (sportSlug) =>
        set((state) => {
          const selectedSports = state.preferences.selectedSports.includes(sportSlug)
            ? state.preferences.selectedSports.filter((s) => s !== sportSlug)
            : [...state.preferences.selectedSports, sportSlug]
          
          return {
            preferences: { ...state.preferences, selectedSports },
          }
        }),
      
      setTimezone: (timezone) =>
        set((state) => ({
          preferences: { ...state.preferences, timezone },
        })),
      
      setNoSpoilerMode: (noSpoilerMode) =>
        set((state) => ({
          preferences: { ...state.preferences, noSpoilerMode },
        })),
      
      setTheme: (theme) =>
        set((state) => ({
          preferences: { ...state.preferences, theme },
        })),
      
      reset: () => set({ preferences: defaultPreferences }),
    }),
    {
      name: 'sports-tracker-preferences',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ preferences: state.preferences }),
    }
  )
)