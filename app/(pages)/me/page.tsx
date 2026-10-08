"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { useAuthStore } from "@/providers/auth-store-providers"

export type MeResponse = {
  id: number
  email: string
  nickname: string
}

export type MeResult = {
  token: string | null
  data: MeResponse | null
  error: string | null
}

export default function MePage() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [result, setResult] = useState<MeResult>({
    token: null,
    data: null,
    error: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login")
      return
    }

    async function loadMyInfo() {
      try {
        const response = await fetch("http://localhost:8080/user-account/me", {
          credentials: "include",
        })

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("다시 로그인해주세요.")
          }

          if (response.status === 403) {
            throw new Error("접근 권한이 없습니다.")
          }

          throw new Error(`내 정보 조회 실패 (${response.status})`)
        }

        setResult({
          token: null,
          data: await response.json() as MeResponse,
          error: null,
        })
      } catch (error) {
        setResult({
          token: null,
          data: null,
          error: error instanceof Error ? error.message : "서버 연결을 확인해주세요.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    void loadMyInfo()
  }, [isAuthenticated, router])

  if (isLoading) {
    return <p>내 정보를 불러오는 중...</p>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">내 정보</h1>

      {result.error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <span className="font-medium">오류:</span> {result.error}
        </p>
      )}

      {result.data && (
        <div className="space-y-2 rounded-lg border p-6">
          <p><span className="font-medium">회원ID:</span> {result.data.id}</p>
          <p><span className="font-medium">이메일:</span> {result.data.email}</p>
          <p><span className="font-medium">닉네임:</span> {result.data.nickname}</p>
          <p className={result.error ? "text-red-600" : "text-muted-foreground"}>
            <span className="font-medium">에러:</span> {result.error ?? "없음"}
          </p>
        </div>
      )}

    </div>
  )
}
