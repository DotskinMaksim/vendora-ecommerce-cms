/**
 * prisma/seed.ts
 *
 * Сценарий для начального заполнения (SEED) базы данными через Prisma.
 * Здесь мы вставляем в таблицы entities, statuses, default_statuses, langs, settings
 * данные из заранее определённого JSON-объекта.
 *
 * Запуск:
 *    npx prisma db seed
 * или
 *    npm run seed  (если прописано в package.json)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Наши данные в формате JSON
const data = {
    entities: [
        { id: 1, name: "user" },
        { id: 2, name: "product" },
        { id: 3, name: "order" },
        { id: 4, name: "transaction" },
        { id: 5, name: "payment_method" },
        { id: 6, name: "shipping_method" },
        { id: 7, name: "promotion" }
    ],
    statuses: [
        { id: 1,  entity_id: 1, name: "active",    color: "#28a745", description: "User account is active and in good standing." },
        { id: 2,  entity_id: 1, name: "pending",   color: "#ffc107", description: "User account is pending activation or verification." },
        { id: 3,  entity_id: 1, name: "inactive",  color: "#6c757d", description: "User account is inactive." },
        { id: 4,  entity_id: 1, name: "suspended", color: "#fd7e14", description: "User account has been suspended due to policy violations." },
        { id: 5,  entity_id: 1, name: "banned",    color: "#dc3545", description: "User account is banned from the platform." },
        { id: 6,  entity_id: 2, name: "draft",     color: "#adb5bd", description: "Product is in draft state and not yet published." },
        { id: 7,  entity_id: 2, name: "active",    color: "#28a745", description: "Product is active and visible on the site." },
        { id: 8,  entity_id: 2, name: "archived",  color: "#6c757d", description: "Product has been archived and is no longer available." },
        { id: 9,  entity_id: 3, name: "pending",   color: "#ffc107", description: "Order is pending confirmation or payment." },
        { id: 10, entity_id: 3, name: "paid",      color: "#28a745", description: "Order has been paid successfully." },
        { id: 11, entity_id: 3, name: "cancelled", color: "#dc3545", description: "Order has been cancelled." },
        { id: 12, entity_id: 3, name: "shipped",   color: "#007bff", description: "Order has been shipped to the customer." },
        { id: 13, entity_id: 3, name: "refunded",  color: "#6f42c1", description: "Order has been refunded." },
        { id: 14, entity_id: 4, name: "pending",   color: "#ffc107", description: "Transaction is pending processing." },
        { id: 15, entity_id: 4, name: "completed", color: "#28a745", description: "Transaction completed successfully." },
        { id: 16, entity_id: 4, name: "failed",    color: "#dc3545", description: "Transaction failed due to an error." },
        { id: 17, entity_id: 4, name: "refunded",  color: "#6f42c1", description: "Transaction has been refunded." },
        { id: 18, entity_id: 5, name: "active",    color: "#28a745", description: "Payment method is active and available." },
        { id: 19, entity_id: 5, name: "inactive",  color: "#6c757d", description: "Payment method is currently inactive." },
        { id: 20, entity_id: 6, name: "active",    color: "#28a745", description: "Shipping method is active and available." },
        { id: 21, entity_id: 6, name: "inactive",  color: "#6c757d", description: "Shipping method is currently inactive." },
        { id: 22, entity_id: 7, name: "active",    color: "#28a745", description: "Promotion is active and currently valid." },
        { id: 23, entity_id: 7, name: "expired",   color: "#6c757d", description: "Promotion has expired and is no longer valid." },
        { id: 24, entity_id: 7, name: "disabled",  color: "#dc3545", description: "Promotion is disabled and cannot be applied." }
    ],
    default_statuses: [
        { entity_id: 1, status_id: 2 },
        { entity_id: 2, status_id: 6 },
        { entity_id: 3, status_id: 9 },
        { entity_id: 4, status_id: 14 },
        { entity_id: 5, status_id: 18 },
        { entity_id: 6, status_id: 20 }
        // (Для promotions(entity_id=7) можешь добавить, если нужно)
    ],
    langs: [
        { id: 1, lang_code: "en", lang_flag_image_url: null }
    ],
    settings: [
        // --- 1. Global site configuration settings ---
        {
            setting_key: "is_set_up",
            setting_value: "false",
            label: "Is site set up",
            description: "Flag indicating whether the initial site setup has been completed. True means the site is fully configured."
        },
        {
            setting_key: "site_name",
            label: "Site name",
            description: "The name of the site, displayed in the header, footer, and page titles."
        },
        {
            setting_key: "default_lang_id",
            label: "Default Language",
            description: "The identifier of the default language used for displaying content and the user interface."
        },
        {
            setting_key: "timezone",
            label: "Timezone",
            description: "The site's timezone for correct display of dates and times."
        },
        {
            setting_key: "currency",
            label: "Main currency",
            description: "The primary currency used for transactions and displaying prices."
        },
        {
            setting_key: "items_per_page",
            label: "Items per page",
            description: "The number of items (e.g., products) displayed on each listing page."
        },
        {
            setting_key: "contact_email",
            label: "Contact email",
            description: "The email address used for administrative tasks, support, and general inquiries."
        },
        {
            setting_key: "logo_url",
            label: "Site logo URL",
            description: "The URL of the site logo displayed in the header and other branding areas."
        },
        {
            setting_key: "maintenance_mode",
            setting_value: "off",
            label: "Maintenance mode",
            description: "Flag indicating whether the site is in maintenance mode. When enabled, the site may be unavailable to users."
        },

        // --- 2. Security and authentication settings ---
        {
            setting_key: "auto_login_enabled",
            setting_value: "false",
            label: "Auto-login enabled",
            description: "Determines whether the system automatically logs in users (e.g., if a valid cookie exists)."
        },
        {
            setting_key: "registration_enabled",
            setting_value: "true",
            label: "User registration",
            description: "Indicates whether new user registration is allowed on the site."
        },
        {
            setting_key: "password_complexity",
            setting_value: "medium",
            label: "Password complexity",
            description: "Password strength requirements (e.g., low, medium, high)."
        },
        {
            setting_key: "two_factor_auth",
            setting_value: "disabled",
            label: "Two-factor authentication",
            description: "Specifies the two-factor authentication mode: either disabled or mandatory."
        },

        // --- 3. Interface and design settings ---
        {
            setting_key: "theme_color",
            setting_value: "",
            label: "Theme color",
            description: "The primary color of the site's theme (used in design elements, links, buttons, etc.)."
        },
        {
            setting_key: "favicon_url",
            label: "Favicon URL",
            description: "The URL of the favicon displayed in the browser tab."
        },
        {
            setting_key: "display_language_selector",
            setting_value: "true",
            label: "Language selector visible",
            description: "Determines whether a language switcher is displayed in the header or footer."
        },

        // --- 4. Localization and data formatting settings ---
        {
            setting_key: "date_format",
            setting_value: "YYYY-MM-DD",
            label: "Date format",
            description: "The format used for displaying dates (e.g., YYYY-MM-DD or DD.MM.YYYY)."
        },
        {
            setting_key: "time_format",
            setting_value: "HH:mm",
            label: "Time format",
            description: "The format used for displaying time (e.g., 24-hour or 12-hour format)."
        },
        {
            setting_key: "number_format",
            setting_value: "1,000.00",
            label: "Number format",
            description: "The formatting rules for numbers on the site (thousands and decimal separators)."
        },

        // --- 5. Email settings ---
        {
            setting_key: "smtp_host",
            setting_value: "",
            label: "SMTP host",
            description: "The SMTP server address for outgoing email messages."
        },
        {
            setting_key: "smtp_port",
            setting_value: "",
            label: "SMTP port",
            description: "The port used by the SMTP server for sending emails."
        },
        {
            setting_key: "smtp_encryption",
            setting_value: "ssl",
            label: "SMTP encryption",
            description: "The type of encryption used for the SMTP connection (ssl or tls)."
        },
        {
            setting_key: "smtp_username",
            setting_value: "",
            label: "SMTP username",
            description: "The username for SMTP authentication."
        },
        {
            setting_key: "smtp_password",
            setting_value: "",
            label: "SMTP password",
            description: "The password for SMTP authentication. Store it securely!"
        },

        // --- 6. SEO and analytics settings ---
        {
            setting_key: "meta_title_default",
            label: "Default Meta Title",
            description: "The default title for pages if no alternative title is provided."
        },
        {
            setting_key: "meta_description_default",
            label: "Default Meta Description",
            description: "The default meta description for pages if none is specified."
        },
        {
            setting_key: "google_analytics_id",
            label: "Google Analytics ID",
            description: "The identifier used for integrating Google Analytics (e.g., UA-XXXXX-Y)."
        },
        {
            setting_key: "robots_indexing",
            setting_value: "true",
            label: "Allow search engine indexing",
            description: "Determines whether search engines are allowed to index the site."
        },

        // --- 7. Payment and order settings (for e-commerce) ---
        {
            setting_key: "payment_gateway",
            setting_value: "paypal",
            label: "Payment Gateway",
            description: "The default payment method (e.g., paypal, stripe, etc.)."
        },
        {
            setting_key: "tax_rate",
            setting_value: "0",
            label: "Tax rate",
            description: "The default tax rate (in percentage) used to calculate product prices."
        },
        {
            setting_key: "shipping_calculation",
            label: "Shipping calculation method",
            description: "The method used to calculate shipping costs (fixed fee, weight-based, etc.)."
        },
        {
            setting_key: "order_notification_email",
            label: "Order notification email",
            description: "The email address to which notifications about new orders are sent."
        },

        // --- 8. Additional settings ---
        {
            setting_key: "enable_caching",
            setting_value: "true",
            label: "Enable caching",
            description: "Enables caching of pages and resources to speed up the site."
        },
        {
            setting_key: "cache_duration",
            setting_value: "3600",
            label: "Cache duration (seconds)",
            description: "The duration (in seconds) for which data is cached."
        },
        {
            setting_key: "enable_debug_mode",
            setting_value: "false",
            label: "Enable debug mode",
            description: "Enables debug mode for developers (displays detailed error messages)."
        },
        {
            setting_key: "cookie_consent_banner",
            setting_value: "true",
            label: "Cookie consent banner",
            description: "Determines whether a cookie consent banner is displayed to users."
        },
        {
            setting_key: "gdpr_compliance",
            setting_value: "true",
            label: "GDPR compliance",
            description: "Activates mechanisms related to the European GDPR data protection regulation."
        }
    ]}
async function main() {
    console.log('Start seeding...')

    // 1. Insert into "entities"
    const entitiesValues = data.entities
        .map(e => `(${e.id}, '${e.name}')`)
        .join(', ')

    await prisma.$executeRawUnsafe(`
    INSERT INTO entities (id, name)
    VALUES ${entitiesValues}
    ON CONFLICT (id) DO NOTHING;
  `)
    console.log('Entities seeded.')

    // 2. Insert into "statuses"
    const statusesValues = data.statuses
        .map(s =>
            `(${s.id}, ${s.entity_id}, '${s.name}', '${s.color}', '${s.description?.replace(/'/g, "''") || ''}')`
        )
        .join(', ')

    await prisma.$executeRawUnsafe(`
    INSERT INTO statuses (id, entity_id, name, color, description)
    VALUES ${statusesValues}
    ON CONFLICT (id) DO NOTHING;
  `)
    console.log('Statuses seeded.')

    // 3. Insert into "default_statuses"
    const dsValues = data.default_statuses
        .map(ds => `(${ds.entity_id}, ${ds.status_id})`)
        .join(', ')

    await prisma.$executeRawUnsafe(`
    INSERT INTO default_statuses (entity_id, status_id)
    VALUES ${dsValues}
    ON CONFLICT (entity_id, status_id) DO NOTHING;
  `)
    console.log('Default statuses seeded.')

    // 4. Insert into "langs"
    const langsValues = data.langs
        .map(l =>
            `(${l.id}, '${l.lang_code}', ${
                l.lang_flag_image_url ? `'${l.lang_flag_image_url}'` : 'NULL'
            })`
        )
        .join(', ')

    await prisma.$executeRawUnsafe(`
    INSERT INTO langs (id, lang_code, lang_flag_image_url)
    VALUES ${langsValues}
    ON CONFLICT (id) DO NOTHING;
  `)
    console.log('Langs seeded.')

    // 5. Insert into "settings"
    const settingsValues = data.settings
        .map(s =>
            `('${s.setting_key}', ${
                s.setting_value ? `'${s.setting_value}'` : 'NULL'
            }, '${s.label}', '${s.description?.replace(/'/g, "''") || ''}')`
        )
        .join(', ')

    await prisma.$executeRawUnsafe(`
    INSERT INTO settings (setting_key, setting_value, label, description)
    VALUES ${settingsValues}
    ON CONFLICT (setting_key) DO NOTHING;
  `)
    console.log('Settings seeded.')

    console.log('Seeding finished successfully.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (err) => {
        console.error('Seeding error:', err)
        await prisma.$disconnect()
        process.exit(1)
    })