"use client";
import React from "react";
import LabelWithPopover from "@/app/(site)/components/LabelWithPopover";
import { SettingDto } from "@/dtos/setting.dto";

interface StepOneProps {
    siteName: string;
    contactEmail: string;
    onSiteNameChange: (value: string) => void;
    onContactEmailChange: (value: string) => void;
    error: string;
    nextStep: () => void;
    getSetting: (key: string) => SettingDto | undefined;
}

const StepOne: React.FC<StepOneProps> = ({
                                             siteName,
                                             contactEmail,
                                             onSiteNameChange,
                                             onContactEmailChange,
                                             error,
                                             nextStep,
                                             getSetting,
                                         }) => {
    return (
        <div>
            <div className="mb-4">
                <LabelWithPopover
                    label={getSetting("site_name")?.label}
                    description={getSetting("site_name")?.description}
                />
                <input
                    type="text"
                    required
                    value={siteName}
                    onChange={(e) => onSiteNameChange(e.target.value)}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                />
            </div>
            <div className="mb-4">
                <LabelWithPopover
                    label={getSetting("contact_email")?.label}
                    description={getSetting("contact_email")?.description}
                />
                <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => onContactEmailChange(e.target.value)}
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
    );
};

export default StepOne;