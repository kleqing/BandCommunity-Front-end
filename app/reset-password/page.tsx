'use client'

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function ResetPasswordPage() {
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        const token = searchParams.get("token")
        if (token) {
            // const event = new CustomEvent("reset-password", { detail: { token } })
            // window.dispatchEvent(event)

            // router.replace(`/?token=${token}`)
            localStorage.setItem("resetToken", token)
            router.replace("/")
        }
    }, [searchParams, router])

    return null // No need to render anything here
}