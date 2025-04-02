// src/dtos/setting.dto.ts

/**
 * DTO для настроек, возвращаемых из Prisma (сущность из БД).
 * Каждый Setting в БД имеет ключ, значение и т.д.
 */
export interface SettingDto {
    key: string;
    value?: string;
    description?: string;
    label: string;
    lastSetBy?: number;
}

/**
 * DTO для передачи данных на /api/setup при первичной установке сайта.
 * Здесь те поля, которые отправляет SetupPage при сабмите.
 */
export interface SetupDto {
    siteName: string;
    contactEmail: string;
    timezone: string;
    currency: string;
    isRegistrationEnabled: boolean;
    autoLoginEnabled: boolean;
    logoUrl: string;
}
