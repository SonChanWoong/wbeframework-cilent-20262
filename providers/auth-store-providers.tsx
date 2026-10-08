"use client"

import { ReactNode, createContext, useContext, useEffect, useState } from "react"
import { useStore } from "zustand"
import type { StoreApi } from "zustand"

import { createAuthStore } from "@/stores/auth-store"
import type { AuthState } from "@/stores/auth-store"

type AuthStore = StoreApi<AuthState>
const AuthStoreContext = createContext<AuthStore | null>(null)

export function AuthStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createAuthStore())

  useEffect(() => {
    store.getState().hydrate()
  }, [store])

  return (
    <AuthStoreContext.Provider value={store}>
      {children}
    </AuthStoreContext.Provider>
  )
}

export function useAuthStore<T>(selector: (state: AuthState) => T): T {
  const store = useContext(AuthStoreContext)

  if (!store) {
    throw new Error("useAuthStore는 AuthStoreProvider 안에서 사용해야 합니다.")
  }

  return useStore(store, selector)
}
