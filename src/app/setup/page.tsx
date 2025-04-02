"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import currencyCodes from "currency-codes";
import moment from "moment-timezone";

// DTO из вашего проекта
import { SettingDto, SetupDto } from "@/dtos/setting.dto";

// Подкомпоненты шагов (исправьте пути, если нужно)
import StepOne from "./(steps)/StepOne";
import StepTwo from "./(steps)/StepTwo";
import StepThree from "./(steps)/StepThree";
import StepFour from "./(steps)/StepFour";

// Вспомогательная функция для конвертации файла в Base64
import { fileToBase64 } from "@/lib/file-helpers";

// Динамический импорт react-select
const ReactSelect = dynamic(() => import("react-select"), { ssr: false });

// -------------------------
// 1. Типы данных
// -------------------------
interface SetupFormData {
    siteName: string;
    contactEmail: string;
    timezone: string;
    currency: string;
    registrationEnabled: boolean;
    autoLoginEnabled: boolean;
    logoMode: "url" | "upload";
    logoUrl: string;
    logoFile: File | null;
}

// Шаг в массиве steps
interface StepDefinition {
    component: React.FC<StepComponentProps>;
    validate: ((data: SetupFormData) => string) | null;
}

// Пропсы, которые получает каждый <StepX />
export interface StepComponentProps extends SetupFormData {
    setFormData: React.Dispatch<React.SetStateAction<SetupFormData>>;
    error: string;
    nextStep: () => void;
    prevStep: () => void;
    getSetting: (key: string) => SettingDto | undefined;
}

// Пропсы для StepContainer (если вдруг используете)
interface StepContainerProps {
    title?: string;
    error?: string;
    children: React.ReactNode;
    onPrev?: () => void;
    onNext?: () => void;
}

// -------------------------
// 2. Пример обёртки: StepContainer
//    (Можно использовать в каждом шаге, если нужно)
// -------------------------
function StepContainer({
                           title,
                           error,
                           children,
                           onPrev,
                           onNext,
                       }: StepContainerProps) {
    return (
        <div className="mb-6">
            {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}

            {children /* Тут лежит сам JSX шага */}

            {error && <p className="text-red-600">{error}</p>}

            <div className="flex justify-between mt-6">
                {onPrev && (
                    <button
                        type="button"
                        onClick={onPrev}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Назад
                    </button>
                )}
                {onNext && (
                    <button
                        type="button"
                        onClick={onNext}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Вперёд
                    </button>
                )}
            </div>
        </div>
    );
}

// -------------------------
// 3. Массив шагов и их валидация
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
            if (data.logoMode === "upload" && !data.logoFile) {
                return "Please choose a file or switch to 'URL' mode.";
            }
            return "";
        },
    },
    {
        component: StepFour,
        validate: null, // Если нет отдельной валидации для финального шага
    },
];

// -------------------------
// 4. Допом: списки таймзон и валют (если нужны глобально)
// -------------------------
const codeList = currencyCodes.codes();
export const currencyOptions = codeList.map((code) => ({ value: code, label: code }));

const timeZoneNames = moment.tz.names();
export const timeZoneOptions = timeZoneNames.map((zone) => ({
    value: zone,
    label: zone,
}));

// -------------------------
// 5. Главный компонент SetupPage
// -------------------------
export default function SetupPage() {
    const router = useRouter();

    // Сколько всего шагов
    const totalSteps = steps.length;

    // Текущий шаг (1-based)
    const [step, setStep] = useState<number>(1);

    // Все данные формы в одном объекте
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

    // Ошибки и настройки из БД
    const [error, setError] = useState("");
    const [settingsFromDB, setSettingsFromDB] = useState<SettingDto[]>([]);

    // При загрузке – получить настройки из /api/settings (опционально)
    useEffect(() => {
        fetch("/api/settings")
            .then((res) => res.json())
            .then((data: SettingDto[]) => setSettingsFromDB(data))
            .catch((err) => console.error(err));
    }, []);

    function getSetting(settingKey: string): SettingDto | undefined {
        return settingsFromDB.find((s) => s.key === settingKey);
    }

    // Кнопка "Далее"
    function nextStep() {
        setError("");
        const currentStepIndex = step - 1; // 0-based
        const validationFn = steps[currentStepIndex].validate;
        if (validationFn) {
            const validationError = validationFn(formData);
            if (validationError) {
                setError(validationError);
                return;
            }
        }
        setStep((prev) => prev + 1);
    }

    // Кнопка "Назад"
    function prevStep() {
        setError("");
        setStep((prev) => prev - 1);
    }

    // Вспомогательная функция для загрузки логотипа
    async function processLogoForSubmit(data: SetupFormData): Promise<string> {
        const { logoMode, logoUrl, logoFile } = data;

        if (logoMode === "url") {
            return logoUrl;
        } else if (logoMode === "upload" && logoFile) {
            const base64 = await fileToBase64(logoFile);
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

    // Сабмит (вызывается на последнем шаге)
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        const {
            siteName,
            contactEmail,
            timezone,
            currency,
            registrationEnabled,
            autoLoginEnabled,
            logoMode,
            logoUrl,
            logoFile,
        } = formData;

        let finalLogoUrl = logoUrl;
        if (logoMode === "upload") {
            try {
                finalLogoUrl = await processLogoForSubmit(formData);
            } catch (err: any) {
                setError(err.message);
                return;
            }
        }

        // DTO для отправки
        const payload: SetupDto = {
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
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const msg = await res.text();
            setError(msg || "Error saving data");
            return;
        }

        router.push("/");
    }

    // Определяем, какой шаг рендерить
    const currentStepIndex = step - 1;
    const CurrentStepComponent = steps[currentStepIndex].component;

    // Прогресс (от 0 до 100%)
    const progressPercent = (step / totalSteps) * 100;

    return (
        <main className="max-w-xl mx-auto p-6">
            {/* Полоса прогресса */}
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

                {/* Если это последний шаг, делаем сабмит формы */}
                {/* Иначе рендерим просто контент + кнопки */}
                {step === totalSteps ? (
                    // Последний шаг: оборачиваем в form, вызываем handleSubmit
                    <form onSubmit={handleSubmit}>
                        <CurrentStepComponent
                            {...formData}
                            setFormData={setFormData}
                            error={error}
                            nextStep={nextStep}
                            prevStep={prevStep}
                            getSetting={getSetting}
                        />
                    </form>
                ) : (
                    // Промежуточные шаги: обычный div + кнопки «Вперёд/Назад» внутри компонента
                    <div>
                        <CurrentStepComponent
                            {...formData}
                            setFormData={setFormData}
                            error={error}
                            nextStep={nextStep}
                            prevStep={prevStep}
                            getSetting={getSetting}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}