"use client";
import React, { useState } from "react";
import { StepComponentProps } from "@/types/setup";
import LabelWithPopover from "@/components/LabelWithPopover";

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
    // Локальная ошибка для загружаемого файла
    const [localError, setLocalError] = useState("");

    return (
        <div>
            <div className="mb-4">
                <LabelWithPopover
                    label={"Site logo"}
                    description={"Logo displayed in the header and other branding areas."}
                />
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
                            onChange={() =>
                                setFormData((prev) => ({
                                    ...prev,
                                    logoMode: "url",
                                    logoFile: null, // Если переключаемся обратно, очищаем файл
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
                                    logoUrl: "", // Если переключаемся на upload, очищаем URL
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
                                    // 1) Проверяем размер (пример: лимит 2MB)
                                    if (file.size > 2 * 1024 * 1024) {
                                        setLocalError("File size exceeds 2 MB limit");
                                        return; // не записываем в formData
                                    } else {
                                        setLocalError("");
                                    }

                                    // 2) Если всё ок — кладём файл в formData
                                    setFormData((prev) => ({ ...prev, logoFile: file }));
                                }
                            }}
                        />
                    </div>
                )}

                {/* Превью (только для режима URL) */}
                {logoMode === "url" && logoUrl && (
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

            {/* Выводим локальную ошибку, если есть */}
            {localError && <p className="text-red-600">{localError}</p>}

            {/* Также может быть общий error из родителя */}
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