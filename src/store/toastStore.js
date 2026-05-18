import { create } from 'zustand'

let idCounter = 0

export const useToastStore = create((set) => ({
  toasts: [],

  addToast: (options) => {
    const id = ++idCounter
    const toast = {
      id,
      message: options.message || '',
      type: options.type || 'info',
      duration: options.duration ?? 5000,
      detail: options.detail || null,
      createdAt: Date.now(),
    }
    set((state) => ({ toasts: [...state.toasts, toast] }))
    return id
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
  },

  clearAll: () => {
    set({ toasts: [] })
  },
}))

export function showToast(message, type = 'info', detail = null) {
  useToastStore.getState().addToast({ message, type, detail })
}

export function showSuccess(message, detail = null) {
  useToastStore.getState().addToast({ message, type: 'success', detail })
}

export function showError(message, detail = null) {
  useToastStore.getState().addToast({ message, type: 'error', detail })
}

export function showWarning(message, detail = null) {
  useToastStore.getState().addToast({ message, type: 'warning', detail })
}
