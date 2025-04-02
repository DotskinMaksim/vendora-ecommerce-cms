"use client";
import React from "react";
import dynamic from "next/dynamic";
import { SettingDto } from "@/dtos/setting.dto";
import LabelWithPopover from "@/app/(site)/components/LabelWithPopover";

const ReactSelect = dynamic(() => import("react-select"), { ssr: false });

interface Option {
    value: string;
    label: string;
}

interface StepTwoProps {
    timezone: string;
    setTimezone: (value: string) => void;
    currency: string;
    setCurrency: (value: string) => void;
    error: string;
    nextStep: () => void;
    prevStep: () => void;
    timeZoneOptions: Option[];
    currencyOptions: Option[];
    getSetting: (key: string) => SettingDto | undefined;
}

const StepTwo: React.FC<StepTwoProps> = ({
                                             timezone,
                                             setTimezone,
                                             currency,
                                             setCurrency,
                                             error,
                                             nextStep,
                                             prevStep,
                                             timeZoneOptions,
                                             currencyOptions,
                                             getSetting,
                                         }) => {
    return (
        <div>
            <div className="mb-4">
                <LabelWithPopover
                    label={getSetting("timezone")?.label}
                    description={getSetting("timezone")?.description}
                />
                <ReactSelect
                    options={timeZoneOptions}
                    value={timeZoneOptions.find((opt) => opt.value === timezone)}
                    onChange={(selectedOption) =>
                        setTimezone((selectedOption as Option).value)
                    }
                    isSearchable
                    placeholder="Select timezone..."
                />
            </div>
            <div className="mb-4">
                <LabelWithPopover
                    label={getSetting("currency")?.label}
                    description={getSetting("currency")?.description}
                />
                <ReactSelect
                    options={currencyOptions}
                    value={currencyOptions.find((opt) => opt.value === currency)}
                    onChange={(selectedOption) =>
                        setCurrency((selectedOption as Option).value)
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
    );
};

export default StepTwo;