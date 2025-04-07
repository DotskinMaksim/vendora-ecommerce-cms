"use client";
import React from "react";
import { StepComponentProps } from "@/types/setup";
import LabelWithPopover from "@/components/LabelWithPopover";

// Now we just use StepComponentProps:
const StepOne: React.FC<StepComponentProps> = ({
                                                   siteName,
                                                   contactEmail,
                                                   setFormData,
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
                    value={siteName}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, siteName: e.target.value }))
                    }
                    className="w-full border rounded px-3 py-2"
                />
            </div>
            <div className="mb-4">
                <LabelWithPopover
                    label={getSetting("contact_email")?.label}
                    description={getSetting("contact_email")?.description}
                />
                <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))
                    }
                    className="w-full border rounded px-3 py-2"
                />
            </div>
            {error && <p className="text-red-600">{error}</p>}
            <div className="flex justify-end mt-6">
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

export default StepOne;