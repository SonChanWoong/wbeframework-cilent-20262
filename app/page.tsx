"use client"

import { useAuthStore } from "@/providers/auth-store-providers"

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">웹 프레임워크</h1>
      <p>{isAuthenticated ? "로그인된 상태입니다." : "로그인이 필요합니다."}</p>
    </div>
  )
}
