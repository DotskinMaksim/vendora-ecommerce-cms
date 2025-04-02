"use client";
import React from "react";

interface StepThreeProps {
    logoMode: "url" | "upload";
    setLogoMode: (mode: "url" | "upload") => void;
    logoUrl: string;
    setLogoUrl: (url: string) => void;
    logoFile: File | null;
    setLogoFile: (file: File | null) => void;
    error: string;
    nextStep: () => void;
    prevStep: () => void;
}

const StepThree: React.FC<StepThreeProps> = ({
                                                 logoMode,
                                                 setLogoMode,
                                                 logoUrl,
                                                 setLogoUrl,
                                                 logoFile,
                                                 setLogoFile,
                                                 error,
                                                 nextStep,
                                                 prevStep,
                                             }) => {
    return (
        <div>
            <div className="mb-4">
                <p className="font-semibold mb-2">Site Logo</p>
                <p className="text-sm text-gray-600 mb-2">
                    Choose to use an existing image URL or upload a file.
                </p>
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

export default StepThree;