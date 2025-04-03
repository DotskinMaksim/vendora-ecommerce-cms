"use client";
import React from "react";
import { StepComponentProps } from "@/types/setup";
import LabelWithPopover from "@/app/components/LabelWithPopover";

const StepThree: React.FC<StepComponentProps> = ({
                                                     logoMode,
                                                     logoUrl,
                                                     logoFile,
                                                     setFormData,
                                                     error,
                                                     nextStep,
                                                     prevStep,
                                                     getSetting,
                                                 }) => {
    return (
        <div>
            <div className="mb-4">
                <LabelWithPopover
                    label={"Site logo"}
                    description={"The site logo displayed in the header and other branding areas."}
                />                <p className="text-sm text-gray-600 mb-2">
                    Choose to use an existing image URL or upload a file.
                </p>
                <div className="mb-2">
                    <label className="inline-flex items-center mr-4">
                        <input
                            type="radio"
                            name="logoMode"
                            value="url"
                            checked={logoMode === "url"}
                            onChange={() =>
                                setFormData((prev) => ({
                                    ...prev,
                                    logoMode: "url",
                                    // If switching to URL mode, you may want to clear out logoFile:
                                    logoFile: null,
                                }))
                            }
                        />
                        <span className="ml-2">Use existing URL</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            name="logoMode"
                            value="upload"
                            checked={logoMode === "upload"}
                            onChange={() =>
                                setFormData((prev) => ({
                                    ...prev,
                                    logoMode: "upload",
                                    // Possibly clear out logoUrl if you want:
                                    logoUrl: "",
                                }))
                            }
                        />
                        <span className="ml-2">Upload file</span>
                    </label>
                </div>

                {logoMode === "url" && (
                    <input
                        type="text"
                        placeholder="https://example.com/logo.png"
                        value={logoUrl}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, logoUrl: e.target.value }))
                        }
                        className="w-full border rounded px-3 py-2"
                    />
                )}

                {logoMode === "upload" && (
                    <div className="mt-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    const file = e.target.files[0];
                                    setFormData((prev) => ({ ...prev, logoFile: file }));
                                }
                            }}
                        />
                    </div>
                )}

                {logoUrl && (
                    <div className="mt-3">
                        <p className="text-sm text-gray-700">Preview:</p>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={logoUrl}
                            alt="Logo preview"
                            style={{ maxWidth: 150, marginTop: 8 }}
                        />
                    </div>
                )}
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

export default StepThree;