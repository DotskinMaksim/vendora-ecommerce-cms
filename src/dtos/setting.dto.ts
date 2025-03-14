// src/dtos/setting.dto.ts

/**
 * DTO для настроек, возвращаемых из Prisma (сущность из БД).
 * Каждый Setting в БД имеет ключ, значение и т.д.
 */
export interface Setting {
    setting_key: string;
    setting_value?: string;
    description?: string;
    label: string;
    last_set_by?: number;
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

    // Новое поле, которое будем сохранять в settings -> logo_url
    logoUrl?: string;
}