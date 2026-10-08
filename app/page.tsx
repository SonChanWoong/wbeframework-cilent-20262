"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button"
import { useAuthStore } from "@/providers/auth-store-providers"

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)

  return (
    <main className="flex min-h-screen items-center justify-center gap-3">
      {isAuthenticated ? (
        <Button onClick={logout}>로그아웃</Button>
      ) : (
        <Link href="/login" className={buttonVariants({ variant: "outline" })}>
          로그인
        </Link>
      )}

      <Link href="/signup" className={buttonVariants()}>
        회원가입
      </Link>
    </main>
  )
}
