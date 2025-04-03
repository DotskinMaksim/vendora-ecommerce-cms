"use client";
import React from "react";
import { StepComponentProps } from "@/types/setup";
import LabelWithPopover from "@/app/components/LabelWithPopover";

// Notice we no longer have "handleSubmit" prop.
// The final step is wrapped in <form> at the parent level.
const StepFour: React.FC<StepComponentProps> = ({
                                                    registrationEnabled,
                                                    autoLoginEnabled,
                                                    siteName,
                                                    contactEmail,
                                                    timezone,
                                                    currency,
                                                    logoUrl,
                                                    setFormData,
                                                    error,
                                                    prevStep,
                                                    getSetting,


                                                }) => {
    return (
        <div>
            <div className="mb-4">
                <LabelWithPopover
                    label={getSetting("registration_enabled")?.label}
                    description={getSetting("registration_enabled")?.description}
                />                <label className="inline-flex items-center mt-2">
                    <input
                        type="checkbox"
                        checked={registrationEnabled}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                registrationEnabled: e.target.checked,
                            }))
                        }
                        className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">Enable user registration</span>
                </label>
            </div>

            <div className="mb-4">
                <LabelWithPopover
                    label={getSetting("auto_login_enabled")?.label}
                    description={getSetting("auto_login_enabled")?.description}
                />                <label className="inline-flex items-center mt-2">
                    <input
                        type="checkbox"
                        checked={autoLoginEnabled}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                autoLoginEnabled: e.target.checked,
                            }))
                        }
                        className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">
            Auto-login for returning users
          </span>
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
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Back
                </button>
                {/* On the last step, the <form> is in the parent, so this button triggers onSubmit */}
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    Save & Complete Setup
                </button>
            </div>
        </div>
    );
};

export default StepFour;