"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FocusEvent, useRef, useState } from "react";

export default function SignUpPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [emailMessage, setEmailMessage] = useState("")
    const [emailStatus, setEmailStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle")
    const emailCheckVersion = useRef(0)

    async function handleEmailBlur(event: FocusEvent<HTMLInputElement>) {
        const input = event.currentTarget
        const email = input.value.trim()

        const version = ++emailCheckVersion.current

        if (!email) {
            setEmailMessage("")
            setEmailStatus("idle")
            return
        }

        if (!input.validity.valid) {
            setEmailMessage("올바른 이메일 형식이 아닙니다")
            setEmailStatus("invalid")
            return
        }

        setEmailMessage("이메일 확인 중...")
        setEmailStatus("checking")

        try {
            const params = new URLSearchParams({ email })

            const response = await fetch(
                `http://localhost:8080/user-account/check-email?${params}`,
                { cache: "no-store" }
            )

            if (!response.ok) {
                throw new Error("이메일 확인 실패")
            }

            const duplicated: boolean = await response.json()

            if (version !== emailCheckVersion.current) {
                return
            }

            setEmailMessage(
                duplicated ? "이미 사용 중인 이메일입니다." : "사용 가능한 이메일입니다."
            )
            setEmailStatus(duplicated ? "invalid" : "valid")

        } catch {
            if (version !== emailCheckVersion.current) {
                return
            }
            setEmailMessage("이메일을 확인할 수 없습니다. 다시 시도해주세요.")
            setEmailStatus("invalid")
        }
    }

    async function handlesubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        const email = String(formData.get("email"))
        const password = String(formData.get("password"))
        const nickname = String(formData.get("nickname"))

        setIsSubmitting(true)

        try {
            const response = await fetch("http://localhost:8080/user-account/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email, password, nickname
                })
            })

            if (!response.ok) {
                const errorBody = await response.json()
                alert(errorBody.message ?? `회원가입에 실패했습니다. (${response.status})`)
                return
            }

            const id = await response.json()

            alert(`회원가입 완료! ID : ${id}`)

        } catch {
            alert("회원가입 중 오류가 발생했습니다.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="flex items-center justify-center">

            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle> 회원가입 </CardTitle>
                </CardHeader>

                <CardContent>
                    <form className="space-y-4" onSubmit={handlesubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="email"> 이메일 </Label>
                            <Input
                                id="email"
                                name="email"
                                placeholder="example@email.com"
                                autoComplete="email"
                                onBlur={handleEmailBlur}
                                onChange={() => {
                                    emailCheckVersion.current++
                                    setEmailMessage("")
                                    setEmailStatus("idle")
                                }}
                                required
                            />
                            {emailMessage && (
                                <p
                                    className={cn(
                                        "text-sm",
                                        emailStatus === "valid" && "text-green-600",
                                        emailStatus === "invalid" && "text-red-600",
                                        emailStatus === "checking" && "text-muted-foreground"
                                    )}
                                >
                                    {emailMessage}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password"> 비밀번호 </Label>
                            <Input id="password" name="password" type="password" placeholder="8자 이상 입력하세요"
                                autoComplete="new-password" minLength={8} maxLength={64} required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nickname"> 닉네임 </Label>
                            <Input id="nickname" name="nickname" placeholder="2~20자로 입력하세요"
                                minLength={2} maxLength={20} required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "가입 중..." : "회원가입"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    )
}
