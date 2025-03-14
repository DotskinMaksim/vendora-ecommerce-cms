"use client";

import { useState, useEffect, FormEvent, Fragment } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import currencyCodes from "currency-codes";
import moment from "moment-timezone";
import LabelWithPopover from "@/app/(site)/components/LabelWithPopover";
// Импортируем наши DTO
import { Setting, SetupDto } from "@/dtos/setting.dto";

import { Popover, Transition } from "@headlessui/react";

// Динамический импорт react-select
const ReactSelect = dynamic(() => import("react-select"), { ssr: false });

// Получаем список ISO-кодов валют
const codeList = currencyCodes.codes();
const currencyOptions = codeList.map((code) => ({ value: code, label: code }));

// Получаем список таймзон через moment
const timeZoneNames = moment.tz.names();
const timeZoneOptions = timeZoneNames.map((zone) => ({ value: zone, label: zone }));

export default function SetupPage() {
    const router = useRouter();

    // Шаги
    const [step, setStep] = useState(1);

    // Стейт для основных настроек
    const [siteName, setSiteName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [timezone, setTimezone] = useState<string>("");
    const [currency, setCurrency] = useState<string>("USD");
    const [registrationEnabled, setRegistrationEnabled] = useState(false);
    const [autoLoginEnabled, setAutoLoginEnabled] = useState(false);

    // Стейт для логотипа
    const [logoMode, setLogoMode] = useState<"url" | "upload">("url");
    const [logoUrl, setLogoUrl] = useState("");
    const [logoFile, setLogoFile] = useState<File | null>(null);

    // Стейт для ошибок и загруженных настроек из БД
    const [error, setError] = useState("");
    const [settingsFromDB, setSettingsFromDB] = useState<Setting[]>([]);

    // Загружаем настройки из БД
    useEffect(() => {
        fetch("/api/settings")
            .then((res) => res.json())
            .then((data: Setting[]) => setSettingsFromDB(data))
            .catch((err) => console.error(err));
    }, []);

    function getSetting(settingKey: string): Setting | undefined {
        return settingsFromDB.find((s) => s.setting_key === settingKey);
    }

    function nextStep() {
        setError("");
        if (step === 1 && (!siteName.trim() || !contactEmail.trim())) {
            setError("Please fill in the required fields (Site Name and Contact Email).");
            return;
        }
        if (step === 2 && (!timezone.trim() || !currency.trim())) {
            setError("Please select your Timezone and Currency.");
            return;
        }
        if (step === 3 && logoMode === "upload" && !logoFile) {
            setError("Please choose a file or switch to 'URL' mode.");
            return;
        }
        setStep((prev) => prev + 1);
    }

    function prevStep() {
        setError("");
        setStep((prev) => prev - 1);
    }

    // Функция для преобразования файла в Base64
    function fileToBase64(file: File) {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result;
                if (!result || typeof result !== "string") {
                    reject(new Error("FileReader error"));
                    return;
                }
                // Убираем префикс "data:...base64,"
                const base64Str = result.replace(/^data:.+;base64,/, "");
                resolve(base64Str);
            };
            reader.onerror = () => reject(new Error("FileReader failed"));
            reader.readAsDataURL(file);
        });
    }

    // ----------------------------------------
    // Обработка логотипа при финальном сабмите
    // ----------------------------------------
    async function processLogoForSubmit(): Promise<string> {
        if (logoMode === "url") {
            // Если пользователь ввёл ссылку вручную, просто возвращаем её
            return logoUrl;
        } else if (logoMode === "upload" && logoFile) {
            // Если выбран режим upload, отправляем файл на /api/upload-logo
            const base64 = await fileToBase64(logoFile);
            const res = await fetch("/api/upload-logo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileBase64: base64 }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Logo upload failed");
            }
            const result = await res.json();
            return result.url; // result.url содержит путь к сохранённому логотипу
        }
        return "";
    }

    // ----------------------------------------
    // Финальный сабмит: обрабатываем логотип, затем отправляем все настройки
    // ----------------------------------------
    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");

        let finalLogoUrl = "";
        if (logoMode === "upload") {
            try {
                finalLogoUrl = await processLogoForSubmit();
            } catch (err: any) {
                setError(err.message);
                return;
            }
        } else {
            finalLogoUrl = logoUrl;
        }

        // Формируем DTO для отправки
        const body: SetupDto = {
            siteName,
            contactEmail,
            timezone,
            currency,
            isRegistrationEnabled: registrationEnabled,
            autoLoginEnabled,
            logoUrl: finalLogoUrl,
        };

        const res = await fetch("/api/setup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const msg = await res.text();
            setError(msg || "Error saving data");
            return;
        }
        router.push("/");
    }

    return (
        <main className="max-w-xl mx-auto p-6">
            <div className="bg-white shadow-md rounded px-8 py-6">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Initial Site Setup</h1>
                <form onSubmit={handleSubmit}>
                    {/* STEP 1: Site Name & Contact Email */}
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
                                <button type="button" onClick={nextStep} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Timezone & Currency */}
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
                                    onChange={(selectedOption) => setTimezone((selectedOption as any).value)}
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
                                    onChange={(selectedOption) => setCurrency((selectedOption as any).value)}
                                    isSearchable
                                    placeholder="Select currency..."
                                />
                            </div>
                            {error && <p className="text-red-600">{error}</p>}
                            <div className="flex justify-between mt-6">
                                <button type="button" onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                                    Back
                                </button>
                                <button type="button" onClick={nextStep} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Logo Selection */}
                    {step === 3 && (
                        <div>
                            <div className="mb-4">
                                <LabelWithPopover
                                    label="Site Logo"
                                    description="Choose to use an existing image URL or upload a file."
                                />
                                <div className="mb-2">
                                    <label className="inline-flex items-center mr-4">
                                        <input
                                            type="radio"
                                            name="logoMode"
                                            value="url"
                                            checked={logoMode === "url"}
                                            onChange={() => setLogoMode("url")}
                                        />
                                        <span className="ml-2">Use existing URL</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="logoMode"
                                            value="upload"
                                            checked={logoMode === "upload"}
                                            onChange={() => setLogoMode("upload")}
                                        />
                                        <span className="ml-2">Upload file</span>
                                    </label>
                                </div>
                                {logoMode === "url" && (
                                    <input
                                        type="text"
                                        placeholder="https://example.com/logo.png"
                                        value={logoUrl}
                                        onChange={(e) => setLogoUrl(e.target.value)}
                                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                                    />
                                )}
                                {logoMode === "upload" && (
                                    <div className="mt-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) {
                                                    setLogoFile(e.target.files[0]);
                                                }
                                            }}
                                        />
                                        {/* Загрузка не происходит тут, а только при финальном сабмите */}
                                    </div>
                                )}
                                {logoUrl && (
                                    <div className="mt-3">
                                        <p className="text-sm text-gray-700">Preview:</p>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={logoUrl} alt="Logo preview" style={{ maxWidth: 150, marginTop: 8 }} />
                                    </div>
                                )}
                            </div>
                            {error && <p className="text-red-600">{error}</p>}
                            <div className="flex justify-between mt-6">
                                <button type="button" onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                                    Back
                                </button>
                                <button type="button" onClick={nextStep} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Registration & Auto Login, and final review */}
                    {step === 4 && (
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
                                    <strong>Logo URL:</strong> {logoUrl || "(none)"}
                                </p>
                                <p>
                                    <strong>Registration Enabled:</strong> {registrationEnabled ? "Yes" : "No"}
                                </p>
                                <p>
                                    <strong>Auto Login:</strong> {autoLoginEnabled ? "Yes" : "No"}
                                </p>
                            </div>
                            {error && <p className="text-red-600">{error}</p>}
                            <div className="flex justify-between mt-6">
                                <button type="button" onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                                    Back
                                </button>
                                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                    Save & Complete Setup
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </main>
    );
}