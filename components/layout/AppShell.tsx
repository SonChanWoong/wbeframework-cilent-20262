"use client"

import type { ReactNode } from "react"

import { useAuthStore } from "@/providers/auth-store-providers"
import Header from "./Header"

type AppShellProps = {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const isHydrated = useAuthStore((state) => state.isHydrated)

  if (!isHydrated) {
    return null
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  )
}
