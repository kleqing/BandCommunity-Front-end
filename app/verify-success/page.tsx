'use client'

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function VerifySuccessPage() {
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        const email = searchParams.get("verifiedEmail")

        if (email) {
            
            localStorage.setItem("emailVerified", email)

            // Redirect to the home page after setting the email
            router.replace("/")
        }
    }, [searchParams, router])

    return null;
}