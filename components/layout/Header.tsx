"use client"

import Link from "next/link"

import { useAuthStore } from "@/providers/auth-store-providers"
import { Button, buttonVariants } from "@/components/ui/button"

export default function Header() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const logout = useAuthStore((state) => state.logout)

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-2 px-4">
        <Link href="/" className="font-bold">웹프레임워크</Link>

        <nav className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link href="/me" className={buttonVariants({ variant: "outline" })}>
                내 페이지
              </Link>
              <Button onClick={() => void logout()}>로그아웃</Button>
            </>
          ) : (
            <>
              <Link href="/signup" className={buttonVariants({ variant: "ghost" })}>
                회원가입
              </Link>
              <Link href="/login" className={buttonVariants()}>
                로그인
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
