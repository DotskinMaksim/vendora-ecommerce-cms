"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"

export default function SetupPage() {
    const router = useRouter()

    const [siteName, setSiteName] = useState("")
    const [contactEmail, setContactEmail] = useState("")
    const [timezone, setTimezone] = useState("")
    const [currency, setCurrency] = useState("USD")
    const [error, setError] = useState("")

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setError("")

        // Вызываем ваш API роут, который сохранит настройки в БД
        const res = await fetch("/api/setup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                siteName,
                contactEmail,
                timezone,
                currency,
            }),
        })

        if (!res.ok) {
            const msg = await res.text()
            setError(msg || "Error saving data")
            return
        }

        // Если всё хорошо, редиректим на главную
        router.push("/")
    }

    return (
        <main style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
            <h1>Initial Site Setup</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Site Name: </label>
                    <input
                        type="text"
                        required
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                    />
                </div>

                <div>
                    <label>Contact Email: </label>
                    <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label>Timezone: </label>
                    <input
                        type="text"
                        placeholder="e.g. Europe/Moscow"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                    />
                </div>

                <div>
                    <label>Currency: </label>
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="RUB">RUB</option>
                        {/* ... */}
                    </select>
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit" style={{ marginTop: 16 }}>Save & Complete Setup</button>
            </form>
        </main>
    )
}