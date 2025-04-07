"use client";
import React from "react";
import { StepComponentProps } from "@/types/setup";
import dynamic from "next/dynamic";
import LabelWithPopover from "@/components/LabelWithPopover";

const ReactSelect = dynamic(() => import("react-select"), { ssr: false });

const StepTwo: React.FC<StepComponentProps> = ({
                                                   timezone,
                                                   currency,
                                                   setFormData,
                                                   error,
                                                   nextStep,
                                                   prevStep,
                                                   getSetting,
                                                   timeZoneOptions = [],
                                                   currencyOptions = [],
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
                        setFormData((prev) => ({
                            ...prev,
                            timezone: (selectedOption as any).value,
                        }))
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
                        setFormData((prev) => ({
                            ...prev,
                            currency: (selectedOption as any).value,
                        }))
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
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={nextStep}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default StepTwo;