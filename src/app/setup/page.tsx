"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"

export default function SetupPage() {
    const router = useRouter()

    // Управляем шагами
    const [step, setStep] = useState(1)

    // Собираем поля формы
    const [siteName, setSiteName] = useState("")
    const [contactEmail, setContactEmail] = useState("")
    const [timezone, setTimezone] = useState("")
    const [currency, setCurrency] = useState("USD")
    const [registrationEnabled, setRegistrationEnabled] = useState(false)
    const [autoLoginEnabled, setAutoLoginEnabled] = useState(false)

    const [error, setError] = useState("")

    // Обработчик общей отправки формы
    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setError("")

        // Сформируем объект с данными со всех шагов
        const body = {
            siteName,
            contactEmail,
            timezone,
            currency,
            isRegistrationEnabled: registrationEnabled,
            autoLoginEnabled
        }

        // Отправляем на наш API роут
        const res = await fetch("/api/setup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })

        if (!res.ok) {
            const msg = await res.text()
            setError(msg || "Error saving data")
            return
        }

        // Успешно — перенаправляем на главную
        router.push("/")
    }

    // Вспомогательные функции для переключения шагов
    function nextStep() {
        setStep((prev) => prev + 1)
    }

    function prevStep() {
        setStep((prev) => prev - 1)
    }

    return (
        <main className="max-w-xl mx-auto p-6">
            <div className="bg-white shadow-md rounded px-8 py-6">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Initial Site Setup</h1>

                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div>
                            <div className="mb-4">
                                <label className="block font-medium mb-1 text-gray-700">
                                    Site Name:
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={siteName}
                                    onChange={(e) => setSiteName(e.target.value)}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block font-medium mb-1 text-gray-700">
                                    Contact Email:
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                />
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <div className="mb-4">
                                <label className="block font-medium mb-1 text-gray-700">
                                    Timezone:
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Europe/Moscow"
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block font-medium mb-1 text-gray-700">
                                    Currency:
                                </label>
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="RUB">RUB</option>
                                    {/* ... другие варианты ... */}
                                </select>
                            </div>

                            <div className="flex justify-between mt-6">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <div className="mb-4">
                                <label className="block font-medium mb-1 text-gray-700">
                                    Allow Registration
                                </label>
                                <label className="inline-flex items-center mt-2">
                                    <input
                                        type="checkbox"
                                        checked={registrationEnabled}
                                        onChange={(e) => setRegistrationEnabled(e.target.checked)}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-700">Enable user registration</span>
                                </label>
                            </div>

                            <div className="mb-4">
                                <label className="block font-medium mb-1 text-gray-700">
                                    Auto Login
                                </label>
                                <label className="inline-flex items-center mt-2">
                                    <input
                                        type="checkbox"
                                        checked={autoLoginEnabled}
                                        onChange={(e) => setAutoLoginEnabled(e.target.checked)}
                                        className="form-checkbox h-5 w-5 text-blue-600"
                                    />
                                    <span className="ml-2 text-gray-700">Auto-login for returning users</span>
                                </label>
                            </div>

                            {/* Выводим все данные для наглядности (необязательно) */}
                            <div className="bg-gray-100 p-4 mb-4 rounded text-sm">
                                <p><strong>Site Name:</strong> {siteName}</p>
                                <p><strong>Contact Email:</strong> {contactEmail}</p>
                                <p><strong>Timezone:</strong> {timezone}</p>
                                <p><strong>Currency:</strong> {currency}</p>
                                <p><strong>Registration Enabled:</strong> {registrationEnabled ? "Yes" : "No"}</p>
                                <p><strong>Auto Login:</strong> {autoLoginEnabled ? "Yes" : "No"}</p>
                            </div>

                            {error && <p className="text-red-600">{error}</p>}

                            <div className="flex justify-between mt-6">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    Save & Complete Setup
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </main>
    )
}