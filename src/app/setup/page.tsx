"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import currencyCodes from "currency-codes";
import moment from "moment-timezone";

import { SettingDto, SetupDto } from "@/dtos/setting.dto";
import { fileToBase64 } from "@/lib/client/file-helpers";

// Import the four steps
import StepOne from "./(steps)/StepOne";
import StepTwo from "./(steps)/StepTwo";
import StepThree from "./(steps)/StepThree";
import StepFour from "./(steps)/StepFour";

// Импортируем типы из отдельного файла
import { SetupFormData, StepDefinition } from "@/types/setup";

// -------------------------
// 2. Готовим выбор таймзон и валют
// -------------------------
const codeList = currencyCodes.codes();
const currencyOptions = codeList.map((code) => ({ value: code, label: code }));

const timeZoneNames = moment.tz.names();
const timeZoneOptions = timeZoneNames.map((zone) => ({
    value: zone,
    label: zone,
}));

// -------------------------
// 3. Шаги и их валидация
// -------------------------
const steps: StepDefinition[] = [
    {
        component: StepOne,
        validate: (data: SetupFormData) => {
            if (!data.siteName.trim() || !data.contactEmail.trim()) {
                return "Please fill in the required fields (Site Name and Contact Email).";
            }
            return "";
        },
    },
    {
        component: StepTwo,
        validate: (data: SetupFormData) => {
            if (!data.timezone.trim() || !data.currency.trim()) {
                return "Please select your Timezone and Currency.";
            }
            return "";
        },
    },
    {
        component: StepThree,
        validate: (data: SetupFormData) => {
            if ((data.logoMode === "upload" && !data.logoFile) || (data.logoMode === "url" && !data.logoUrl) ) {
                return "Please choose a file or fill in the URL.";
            }
            return "";
        },
    },
    {
        component: StepFour,
        validate: null, // No special validation here
    },
];

// -------------------------
// 4. Главный компонент SetupPage
// -------------------------
export default function SetupPage() {
    const router = useRouter();
    const totalSteps = steps.length;
    const [step, setStep] = useState<number>(1);

    // Our entire form data in a single object:
    const [formData, setFormData] = useState<SetupFormData>({
        siteName: "",
        contactEmail: "",
        timezone: "",
        currency: "USD",
        registrationEnabled: false,
        autoLoginEnabled: false,
        logoMode: "url",
        logoUrl: "",
        logoFile: null,
    });

    // We store the error and the settings fetched from DB
    const [error, setError] = useState("");
    const [settingsFromDB, setSettingsFromDB] = useState<SettingDto[]>([]);

    // Fetch settings from DB once on mount
    useEffect(() => {
        fetch("/api/settings")
            .then((res) => res.json())
            .then((data: SettingDto[]) => setSettingsFromDB(data))
            .catch((err) => console.error(err));
    }, []);

    function getSetting(settingKey: string): SettingDto | undefined {
        return settingsFromDB.find((s) => s.key === settingKey);
    }

    function nextStep() {
        setError("");
        const currentStepIndex = step - 1;
        const validateFn = steps[currentStepIndex]?.validate;
        if (validateFn) {
            const validationError = validateFn(formData);
            if (validationError) {
                setError(validationError);
                return;
            }
        }
        setStep((prev) => prev + 1);
    }

    function prevStep() {
        setError("");
        setStep((prev) => prev - 1);
    }

    // Logic for uploading / storing the logo
    async function processLogoForSubmit(data: SetupFormData): Promise<string> {
        if (data.logoMode === "url") {
            return data.logoUrl;
        } else if (data.logoMode === "upload" && data.logoFile) {
            const base64 = await fileToBase64(data.logoFile);
            const res = await fetch("/api/upload-logo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileBase64: base64 }),
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Logo upload failed");
            }
            const result = await res.json();
            return result.url;
        }
        return "";
    }

    // Called on the final step
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        let finalLogoUrl = formData.logoUrl;
        if (formData.logoMode === "upload") {
            try {
                finalLogoUrl = await processLogoForSubmit(formData);
            } catch (err: any) {
                setError(err.message);
                return;
            }
        }

        const payload: SetupDto = {
            siteName: formData.siteName,
            contactEmail: formData.contactEmail,
            timezone: formData.timezone,
            currency: formData.currency,
            isRegistrationEnabled: formData.registrationEnabled,
            autoLoginEnabled: formData.autoLoginEnabled,
            logoUrl: finalLogoUrl,
        };

        const res = await fetch("/api/setup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const msg = await res.text();
            setError(msg || "Error saving data");
            return;
        }
        router.push("/");
    }

    const currentStepIndex = step - 1;
    const CurrentStepComponent = steps[currentStepIndex].component;
    const progressPercent = (step / totalSteps) * 100;

    return (
        <main className="max-w-xl mx-auto p-6">
            {/* Progress bar */}
            <div className="w-full bg-gray-200 h-2 rounded mb-4">
                <div
                    className="bg-blue-600 h-2 rounded"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            <div className="bg-white shadow-md rounded px-8 py-6">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">
                    Initial Site Setup
                </h1>

                {step === totalSteps ? (
                    // On the last step, we wrap in <form> so we can submit
                    <form onSubmit={handleSubmit}>
                        <CurrentStepComponent
                            {...formData}
                            setFormData={setFormData}
                            error={error}
                            nextStep={nextStep}
                            prevStep={prevStep}
                            getSetting={getSetting}
                            timeZoneOptions={timeZoneOptions}
                            currencyOptions={currencyOptions}
                        />
                    </form>
                ) : (
                    // On earlier steps, just a normal div
                    <div>
                        <CurrentStepComponent
                            {...formData}
                            setFormData={setFormData}
                            error={error}
                            nextStep={nextStep}
                            prevStep={prevStep}
                            getSetting={getSetting}
                            timeZoneOptions={timeZoneOptions}
                            currencyOptions={currencyOptions}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}