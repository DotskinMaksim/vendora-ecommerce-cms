"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"

export default function SetupWizardPage() {
    const router = useRouter()
    const [siteName, setSiteName] = useState("")
    const [adminEmail, setAdminEmail] = useState("")
    const [adminPassword, setAdminPassword] = useState("")
    const [error, setError] = useState("")

    async function handleSetup(e: React.FormEvent) {
        e.preventDefault()
        setError("")

        // Вызываем API, передаём настройки
        const res = await fetch("/api/setup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ siteName, adminEmail, adminPassword }),
        })
        const data = await res.json()
        if (!res.ok) {
            setError(data.error || "Setup failed")
        } else {
            // Успешно, перенаправляем в админку или на главную
            router.push("/admin")
        }
    }

    return (
        <div>
            <h1>Site Setup</h1>
            <form onSubmit={handleSetup}>
                <input
                    type="text"
                    placeholder="Site name"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Admin email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Admin password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                />
                <button type="submit">Complete Setup</button>
            </form>
            {error && <p style={{color: "red"}}>{error}</p>}
        </div>
    )
}