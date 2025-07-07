import { create } from 'zustand'

interface UIStore {
  // Navigation
  isMobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  
  // Filters
  eventFilters: {
    sports: string[]
    dateRange: { start: Date | null; end: Date | null }
    status: string[]
    search: string
  }
  setEventFilters: (filters: Partial<UIStore['eventFilters']>) => void
  resetEventFilters: () => void
  
  // Loading states
  loadingStates: Record<string, boolean>
  setLoading: (key: string, loading: boolean) => void
  
  // Modal states
  modals: {
    reminderModal: { isOpen: boolean; eventId: string | null }
    sportSelectorModal: { isOpen: boolean }
  }
  openModal: (modal: keyof UIStore['modals'], data?: any) => void
  closeModal: (modal: keyof UIStore['modals']) => void
}

const defaultFilters: UIStore['eventFilters'] = {
  sports: [],
  dateRange: { start: null, end: null },
  status: [],
  search: '',
}

export const useUIStore = create<UIStore>((set) => ({
  // Navigation
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  
  // Filters
  eventFilters: defaultFilters,
  setEventFilters: (filters) =>
    set((state) => ({
      eventFilters: { ...state.eventFilters, ...filters },
    })),
  resetEventFilters: () => set({ eventFilters: defaultFilters }),
  
  // Loading states
  loadingStates: {},
  setLoading: (key, loading) =>
    set((state) => ({
      loadingStates: { ...state.loadingStates, [key]: loading },
    })),
  
  // Modal states
  modals: {
    reminderModal: { isOpen: false, eventId: null },
    sportSelectorModal: { isOpen: false },
  },
  openModal: (modal, data) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modal]: { isOpen: true, ...data },
      },
    })),
  closeModal: (modal) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modal]: { ...state.modals[modal], isOpen: false },
      },
    })),
}))