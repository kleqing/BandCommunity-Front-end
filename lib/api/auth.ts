import { toast } from "sonner";

export async function login(email: string, password: string) {
    const res = await fetch("https://localhost:7160/api/Authorize/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
    })

    if (!res.ok) {
        const error = await res.json()
        if (error.message.includes("confirmed") || error.message.includes("not confirmed") || error.message.includes("verify")) {
            toast.error("Email is not confirmed. Please check your email for the confirmation link.")
        }
        throw new Error(error.message || "Login failed")
    }

    return res.json()
}

export async function signup(data: any) {
    const res = await fetch("https://localhost:7160/api/Authorize/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })

    const result = await res.json()
    if (!res.ok || !result.success) {
        const message = result.message || "Signup failed"
        throw new Error(message)
    }

    return result
}

export async function logout() {
    try {
        const res = await fetch("https://localhost:7160/api/Authorize/logout", {
            method: "POST",
            credentials: "include"
        });

        if (!res.ok) {
            throw new Error("Logout failed");
        }
    }
    catch (error) {
        console.error(error);
    }
}

    export async function forgotPassword(email: string) {
        const res = await fetch("https://localhost:7160/api/Authorize/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.message || "Forgot password failed")
        }

        return res.json()
    }

    export async function resendEmail(email: string) {
        const res = await fetch("https://localhost:7160/api/Authorize/resend-email-confirmation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        })

        if (!res.ok) {
            const error = await res.json()
            if (error.message.includes("not confirmed") || error.message.includes("verify")) {
                toast.error("Email is not confirmed. Please check your email for the confirmation link.")
            }
            else if (error.message.includes("confirmed")) {
                toast.success("Email is already confirmed. You can login now.")
            }
            throw new Error(error.message || "Login failed")
        }

        return res.json()
    }

    export async function resetPassword(token: string, newPassword: string, confirmPassword: string) {
        const res = await fetch("https://localhost:7160/api/Authorize/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                Token: token,
                NewPassword: newPassword,
                ConfirmPassword: confirmPassword
            }),
        });

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.message || "Reset password failed")
        }
    }