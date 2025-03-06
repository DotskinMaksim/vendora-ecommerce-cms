"use client"

import React, { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        // Вызываем signIn с credentials
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false, // не перенаправляем сразу
        })

        if (result?.error) {
            setError(result.error)
        } else {
            // Успешно залогинились: перенаправим на /profile или главную
            router.push("/profile")
        }
    }

    return (
        <div style={{ maxWidth: 300, margin: "50px auto" }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Log In</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    )
}