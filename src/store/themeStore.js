import { create } from 'zustand'

const STORAGE_KEY = 'theme'

const getInitialTheme = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') {
    return stored
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme)
}

const useThemeStore = create((set, get) => ({
  theme: 'light',

  initialize: () => {
    const theme = getInitialTheme()
    set({ theme })
    applyTheme(theme)
  },

  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light'
    set({ theme: newTheme })
    localStorage.setItem(STORAGE_KEY, newTheme)
    applyTheme(newTheme)
  },

  setTheme: (theme) => {
    if (theme === 'light' || theme === 'dark') {
      set({ theme })
      localStorage.setItem(STORAGE_KEY, theme)
      applyTheme(theme)
    }
  }
}))

export default useThemeStore
