// src/types/setup.ts
import { SettingDto } from "@/dtos/setting.dto";

export interface SetupFormData {
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

export interface StepComponentProps extends SetupFormData {
    setFormData: React.Dispatch<React.SetStateAction<SetupFormData>>;
    error: string;
    nextStep: () => void;
    prevStep: () => void;
    getSetting: (key: string) => SettingDto | undefined;
    timeZoneOptions?: { value: string; label: string }[];
    currencyOptions?: { value: string; label: string }[];
}

export interface StepDefinition {
    component: React.FC<StepComponentProps>;
    validate: ((data: SetupFormData) => string) | null;
}