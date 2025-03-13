"use client"

import { useState, useEffect, FormEvent, Fragment } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import currencyCodes from "currency-codes"
import moment from "moment-timezone"

import { SettingModel } from "@/types/prisma"
import type { z } from "zod"

type Setting = z.infer<typeof SettingModel>;


import { Popover, Transition } from "@headlessui/react"

// Динамический импорт react-select
const ReactSelect = dynamic(() => import("react-select"), { ssr: false })

// Получаем список ISO-кодов валют
const codeList = currencyCodes.codes()
const currencyOptions = codeList.map((code) => ({ value: code, label: code }))

// Получаем список таймзон через moment
const timeZoneNames = moment.tz.names()
const timeZoneOptions = timeZoneNames.map((zone) => ({ value: zone, label: zone }))


// Поповер-метка c анимацией и «стрелочкой»
function LabelWithPopover({
                              label,
                              description,
                          }: {
    label: string
    description: string
}) {
    return (
        <div className="flex items-center mb-1">
            <span className="font-medium text-gray-700 mr-2">{label}</span>
            <Popover className="relative">
                <Popover.Button
                    className="inline-flex items-center justify-center
                     w-5 h-5 rounded-full text-white
                     bg-blue-500 hover:bg-blue-600
                     focus:outline-none focus:ring-2 focus:ring-blue-300
                     text-sm"
                    title="Show info"
                >
                    ?
                </Popover.Button>

                {/* Анимация через Transition */}
                <Transition
                    as={Fragment}
                    enter="transition duration-200 ease-out"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition duration-150 ease-in"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                >
                    <Popover.Panel
                        className="absolute z-10 mt-2 left-1/2 -translate-x-1/2 w-72
                       bg-white border border-gray-200 shadow-lg rounded
                       p-4"
                        static
                    >
                        {/* Стрелочка */}
                        <div className="absolute top-0 left-1/2 w-3 h-3 -mt-2 -translate-x-1/2 rotate-45 bg-white border-l border-t border-gray-200" />
                        <p className="text-sm text-gray-700">{description}</p>
                    </Popover.Panel>
                </Transition>
            </Popover>
        </div>
    )
}

export default function SetupPage() {
    const router = useRouter()

    // Шаги
    const [step, setStep] = useState(1)

    // Стейт для данных формы
    const [siteName, setSiteName] = useState("")
    const [contactEmail, setContactEmail] = useState("")
    const [timezone, setTimezone] = useState<string>("")
    const [currency, setCurrency] = useState<string>("USD")
    const [registrationEnabled, setRegistrationEnabled] = useState(false)
    const [autoLoginEnabled, setAutoLoginEnabled] = useState(false)

    // Стейт для ошибок и настроек
    const [error, setError] = useState("")
    const [settingsFromDB, setSettingsFromDB] = useState<Setting[]>([])

    // 1. Загружаем настройки из БД при монтировании
    useEffect(() => {
        fetch("/api/settings")
            .then((res) => res.json())
            .then((data: Setting[]) => {
                setSettingsFromDB(data)
            })
            .catch((err) => {
                console.error(err)
            })
    }, [])

    // 2. Вспомогательная функция, чтобы найти setting по ключу
    function getSetting(settingKey: string): Setting | undefined {
        return settingsFromDB.find((s) => s.setting_key === settingKey)
    }

    // Сохраняем
    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setError("")

        const body = {
            siteName,
            contactEmail,
            timezone,
            currency,
            isRegistrationEnabled: registrationEnabled,
            autoLoginEnabled,
        }

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
        router.push("/")
    }

    function nextStep() {
        setError("")
        if (step === 1) {
            if (!siteName.trim() || !contactEmail.trim()) {
                setError("Please fill in the required fields (Site Name and Contact Email).")
                return
            }
        } else if (step === 2) {
            if (!timezone.trim() || !currency.trim()) {
                setError("Please select your Timezone and Currency.")
                return
            }
        }
        setStep((prev) => prev + 1)
    }

    function prevStep() {
        setError("")
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
                                <LabelWithPopover
                                    label={getSetting("site_name")?.label || "Site Name:"}
                                    description={
                                        getSetting("site_name")?.description ||
                                        "Public name of your site, shown in headers, etc."
                                    }
                                />
                                <input
                                    type="text"
                                    required
                                    value={siteName}
                                    onChange={(e) => setSiteName(e.target.value)}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                />
                            </div>

                            <div className="mb-4">
                                <LabelWithPopover
                                    label={getSetting("contact_email")?.label || "Contact Email:"}
                                    description={
                                        getSetting("contact_email")?.description ||
                                        "Email for administrative notifications and user contacts."
                                    }
                                />
                                <input
                                    type="email"
                                    required
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                />
                            </div>

                            {error && <p className="text-red-600">{error}</p>}

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
                                <LabelWithPopover
                                    label={getSetting("timezone")?.label || "Timezone:"}
                                    description={
                                        getSetting("timezone")?.description ||
                                        "Select the default timezone for your site."
                                    }
                                />
                                <ReactSelect
                                    options={timeZoneOptions}
                                    value={timeZoneOptions.find((opt) => opt.value === timezone)}
                                    onChange={(selectedOption) =>
                                        setTimezone((selectedOption as any).value)
                                    }
                                    isSearchable
                                    placeholder="Select timezone..."
                                />
                            </div>

                            <div className="mb-4">
                                <LabelWithPopover
                                    label={getSetting("currency")?.label || "Currency:"}
                                    description={
                                        getSetting("currency")?.description ||
                                        "Select the currency used for prices."
                                    }
                                />
                                <ReactSelect
                                    options={currencyOptions}
                                    value={currencyOptions.find((opt) => opt.value === currency)}
                                    onChange={(selectedOption) =>
                                        setCurrency((selectedOption as any).value)
                                    }
                                    isSearchable
                                    placeholder="Select currency..."
                                />
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
                                <LabelWithPopover
                                    label={getSetting("allow_registration")?.label || "Allow Registration"}
                                    description={
                                        getSetting("allow_registration")?.description ||
                                        "If enabled, new users can register an account."
                                    }
                                />
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
                                <LabelWithPopover
                                    label={getSetting("auto_login")?.label || "Auto Login"}
                                    description={
                                        getSetting("auto_login")?.description ||
                                        "If enabled, returning users may be auto-logged in."
                                    }
                                />
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

                            <div className="bg-gray-100 p-4 mb-4 rounded text-sm">
                                <p>
                                    <strong>Site Name:</strong> {siteName}
                                </p>
                                <p>
                                    <strong>Contact Email:</strong> {contactEmail}
                                </p>
                                <p>
                                    <strong>Timezone:</strong> {timezone}
                                </p>
                                <p>
                                    <strong>Currency:</strong> {currency}
                                </p>
                                <p>
                                    <strong>Registration Enabled:</strong>{" "}
                                    {registrationEnabled ? "Yes" : "No"}
                                </p>
                                <p>
                                    <strong>Auto Login:</strong> {autoLoginEnabled ? "Yes" : "No"}
                                </p>
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