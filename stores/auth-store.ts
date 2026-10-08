import { createStore } from "zustand/vanilla"

export type AuthState = {
  isAuthenticated: boolean
  login: () => void
  logout: () => Promise<void>
  hydrate: () => Promise<void>
}

export function createAuthStore() {
  return createStore<AuthState>((set) => ({
    isAuthenticated: false,
    login: () => {
      set({ isAuthenticated: true })
    },
    logout: async () => {
      await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      set({ isAuthenticated: false })
    },
    hydrate: async () => {
      const response = await fetch("http://localhost:8080/auth/me", {
        credentials: "include",
      }).catch(() => null)
      set({ isAuthenticated: response?.ok === true })
    },
  }))
}
