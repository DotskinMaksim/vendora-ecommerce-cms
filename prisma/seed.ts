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
        { id: 1,  name: "English",           code: "en", flag_image_url: "https://flagcdn.com/h20/us.png", is_using: true },
        { id: 2,  name: "Russian",           code: "ru", flag_image_url: "https://flagcdn.com/h20/ru.png", is_using: false },
        { id: 3,  name: "Spanish",           code: "es", flag_image_url: "https://flagcdn.com/h20/es.png", is_using: false },
        { id: 4,  name: "French",            code: "fr", flag_image_url: "https://flagcdn.com/h20/fr.png", is_using: false },
        { id: 5,  name: "German",            code: "de", flag_image_url: "https://flagcdn.com/h20/de.png", is_using: false },
        { id: 6,  name: "Italian",           code: "it", flag_image_url: "https://flagcdn.com/h20/it.png", is_using: false },
        { id: 7,  name: "Dutch",             code: "nl", flag_image_url: "https://flagcdn.com/h20/nl.png", is_using: false },
        { id: 8,  name: "Portuguese",        code: "pt", flag_image_url: "https://flagcdn.com/h20/pt.png", is_using: false },
        { id: 9,  name: "Chinese (Simplified)", code: "zh", flag_image_url: "https://flagcdn.com/h20/cn.png", is_using: false },
        { id: 10, name: "Japanese",          code: "ja", flag_image_url: "https://flagcdn.com/h20/jp.png", is_using: false },
        { id: 11, name: "Korean",            code: "ko", flag_image_url: "https://flagcdn.com/h20/kr.png", is_using: false },
        { id: 12, name: "Arabic",            code: "ar", flag_image_url: "https://flagcdn.com/h20/sa.png", is_using: false },
        { id: 13, name: "Turkish",           code: "tr", flag_image_url: "https://flagcdn.com/h20/tr.png", is_using: false },
        { id: 14, name: "Polish",            code: "pl", flag_image_url: "https://flagcdn.com/h20/pl.png", is_using: false },
        { id: 15, name: "Swedish",           code: "sv", flag_image_url: "https://flagcdn.com/h20/se.png", is_using: false },
        { id: 16, name: "Danish",            code: "da", flag_image_url: "https://flagcdn.com/h20/dk.png", is_using: false },
        { id: 17, name: "Norwegian",         code: "no", flag_image_url: "https://flagcdn.com/h20/no.png", is_using: false },
        { id: 18, name: "Finnish",           code: "fi", flag_image_url: "https://flagcdn.com/h20/fi.png", is_using: false },
        { id: 19, name: "Czech",             code: "cs", flag_image_url: "https://flagcdn.com/h20/cz.png", is_using: false },
        { id: 20, name: "Greek",             code: "el", flag_image_url: "https://flagcdn.com/h20/gr.png", is_using: false },
        { id: 21, name: "Hindi",             code: "hi", flag_image_url: "https://flagcdn.com/h20/in.png", is_using: false },
        { id: 22, name: "Hebrew",            code: "he", flag_image_url: "https://flagcdn.com/h20/il.png", is_using: false },
        { id: 23, name: "Romanian",          code: "ro", flag_image_url: "https://flagcdn.com/h20/ro.png", is_using: false },
        { id: 24, name: "Hungarian",         code: "hu", flag_image_url: "https://flagcdn.com/h20/hu.png", is_using: false },
        { id: 25, name: "Indonesian",        code: "id", flag_image_url: "https://flagcdn.com/h20/id.png", is_using: false }
    ],
    settings: [
        // --- 1. Global site configuration settings ---
        {
            key: "setup_completed",
            value: "false",
            label: "Is site set up",
            description: "Flag indicating whether the initial site setup has been completed. True means the site is fully configured."
        },
        {
            key: "site_name",
            label: "Site name",
            description: "The name of the site, displayed in the header, footer, and page titles."
        },
        {
            key: "default_lang_id",
            label: "Default Language",
            description: "The identifier of the default language used for displaying content and the user interface."
        },
        {
            key: "timezone",
            label: "Timezone",
            description: "The site's timezone for correct display of dates and times."
        },
        {
            key: "currency",
            label: "Main currency",
            description: "The primary currency used for transactions and displaying prices."
        },
        {
            key: "items_per_page",
            label: "Items per page",
            description: "The number of items (e.g., products) displayed on each listing page."
        },
        {
            key: "contact_email",
            label: "Contact email",
            description: "The email address used for administrative tasks, support, and general inquiries."
        },
        {
            key: "logo_url",
            label: "Site logo URL",
            description: "The URL of the site logo displayed in the header and other branding areas."
        },
        {
            key: "maintenance_mode",
            value: "off",
            label: "Maintenance mode",
            description: "Flag indicating whether the site is in maintenance mode. When enabled, the site may be unavailable to users."
        },

        // --- 2. Security and authentication settings ---
        {
            key: "auto_login_enabled",
            value: "false",
            label: "Auto-login enabled",
            description: "Determines whether the system automatically logs in users (e.g., if a valid cookie exists)."
        },
        {
            key: "registration_enabled",
            value: "true",
            label: "User registration",
            description: "Indicates whether new user registration is allowed on the site."
        },
        {
            key: "password_complexity",
            value: "medium",
            label: "Password complexity",
            description: "Password strength requirements (e.g., low, medium, high)."
        },
        {
            key: "two_factor_auth",
            value: "disabled",
            label: "Two-factor authentication",
            description: "Specifies the two-factor authentication mode: either disabled or mandatory."
        },

        // --- 3. Interface and design settings ---
        {
            key: "theme_color",
            value: "",
            label: "Theme color",
            description: "The primary color of the site's theme (used in design elements, links, buttons, etc.)."
        },
        {
            key: "favicon_url",
            label: "Favicon URL",
            description: "The URL of the favicon displayed in the browser tab."
        },
        {
            key: "display_language_selector",
            value: "true",
            label: "Language selector visible",
            description: "Determines whether a language switcher is displayed in the header or footer."
        },

        // --- 4. Localization and data formatting settings ---
        {
            key: "date_format",
            value: "YYYY-MM-DD",
            label: "Date format",
            description: "The format used for displaying dates (e.g., YYYY-MM-DD or DD.MM.YYYY)."
        },
        {
            key: "time_format",
            value: "HH:mm",
            label: "Time format",
            description: "The format used for displaying time (e.g., 24-hour or 12-hour format)."
        },
        {
            key: "number_format",
            value: "1,000.00",
            label: "Number format",
            description: "The formatting rules for numbers on the site (thousands and decimal separators)."
        },

        // --- 5. Email settings ---
        {
            key: "smtp_host",
            value: "",
            label: "SMTP host",
            description: "The SMTP server address for outgoing email messages."
        },
        {
            key: "smtp_port",
            value: "",
            label: "SMTP port",
            description: "The port used by the SMTP server for sending emails."
        },
        {
            key: "smtp_encryption",
            value: "ssl",
            label: "SMTP encryption",
            description: "The type of encryption used for the SMTP connection (ssl or tls)."
        },
        {
            key: "smtp_username",
            value: "",
            label: "SMTP username",
            description: "The username for SMTP authentication."
        },
        {
            key: "smtp_password",
            value: "",
            label: "SMTP password",
            description: "The password for SMTP authentication. Store it securely!"
        },

        // --- 6. SEO and analytics settings ---
        {
            key: "meta_title_default",
            label: "Default Meta Title",
            description: "The default title for pages if no alternative title is provided."
        },
        {
            key: "meta_description_default",
            label: "Default Meta Description",
            description: "The default meta description for pages if none is specified."
        },
        {
            key: "google_analytics_id",
            label: "Google Analytics ID",
            description: "The identifier used for integrating Google Analytics (e.g., UA-XXXXX-Y)."
        },
        {
            key: "robots_indexing",
            value: "true",
            label: "Allow search engine indexing",
            description: "Determines whether search engines are allowed to index the site."
        },

        // --- 7. Payment and order settings (for e-commerce) ---
        {
            key: "payment_gateway",
            value: "paypal",
            label: "Payment Gateway",
            description: "The default payment method (e.g., paypal, stripe, etc.)."
        },
        {
            key: "tax_rate",
            value: "0",
            label: "Tax rate",
            description: "The default tax rate (in percentage) used to calculate product prices."
        },
        {
            key: "shipping_calculation",
            label: "Shipping calculation method",
            description: "The method used to calculate shipping costs (fixed fee, weight-based, etc.)."
        },
        {
            key: "order_notification_email",
            label: "Order notification email",
            description: "The email address to which notifications about new orders are sent."
        },

        // --- 8. Additional settings ---
        {
            key: "enable_caching",
            value: "true",
            label: "Enable caching",
            description: "Enables caching of pages and resources to speed up the site."
        },
        {
            key: "cache_duration",
            value: "3600",
            label: "Cache duration (seconds)",
            description: "The duration (in seconds) for which data is cached."
        },
        {
            key: "enable_debug_mode",
            value: "false",
            label: "Enable debug mode",
            description: "Enables debug mode for developers (displays detailed error messages)."
        },
        {
            key: "cookie_consent_banner",
            value: "true",
            label: "Cookie consent banner",
            description: "Determines whether a cookie consent banner is displayed to users."
        },
        {
            key: "gdpr_compliance",
            value: "true",
            label: "GDPR compliance",
            description: "Activates mechanisms related to the European GDPR data protection regulation."
        }
    ]}
const settingCategories = [
    {
        name: "Global site configuration",
        keys: [
            "setup_completed",
            "site_name",
            "default_lang_id",
            "timezone",
            "currency",
            "items_per_page",
            "contact_email",
            "logo_url",
            "maintenance_mode"
        ]
    },
    {
        name: "Security and authentication",
        keys: [
            "auto_login_enabled",
            "registration_enabled",
            "password_complexity",
            "two_factor_auth"
        ]
    },
    {
        name: "Interface and design",
        keys: [
            "theme_color",
            "favicon_url",
            "display_language_selector"
        ]
    },
    {
        name: "Localization and data formatting",
        keys: [
            "date_format",
            "time_format",
            "number_format"
        ]
    },
    {
        name: "Email",
        keys: [
            "smtp_host",
            "smtp_port",
            "smtp_encryption",
            "smtp_username",
            "smtp_password"
        ]
    },
    {
        name: "SEO and analytics",
        keys: [
            "meta_title_default",
            "meta_description_default",
            "google_analytics_id",
            "robots_indexing"
        ]
    },
    {
        name: "Payment and order",
        keys: [
            "payment_gateway",
            "tax_rate",
            "shipping_calculation",
            "order_notification_email"
        ]
    },
    {
        name: "Additional",
        keys: [
            "enable_caching",
            "cache_duration",
            "enable_debug_mode",
            "cookie_consent_banner",
            "gdpr_compliance"
        ]
    }
];
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

    const langsValues = data.langs
        .map(l => {
            const safeName = l.name.replace(/'/g, "''");
            return `(${l.id}, '${safeName}', '${l.code}', ${l.flag_image_url ? `'${l.flag_image_url}'` : 'NULL'}, ${l.is_using ? 'true' : 'false'})`;
        })
        .join(', ');
    await prisma.$executeRawUnsafe(`
        INSERT INTO langs (id, name, code, flag_image_url, is_using)
        VALUES ${langsValues}
            ON CONFLICT (id) DO NOTHING;
    `);
    console.log('Langs seeded.')

    // 5. Insert into "settings"
    const settingsValues = data.settings
        .map(s =>
            `('${s.key}', ${
                s.value ? `'${s.value}'` : 'NULL'
            }, '${s.label}', '${s.description?.replace(/'/g, "''") || ''}')`
        )
        .join(', ')

    await prisma.$executeRawUnsafe(`
    INSERT INTO settings (key, value, label, description)
    VALUES ${settingsValues}
    ON CONFLICT (key) DO NOTHING;
  `)
    console.log('Settings seeded.')

    // 6. Создаём категории (setting_categories)
    //    Один раз для всех категорий из массива settingCategories
    for (const cat of settingCategories) {
        // Используем Prisma API для upsert по имени
        const createdCat = await prisma.settingCategory.upsert({
            where: { name: cat.name },
            update: {}, // ничего не обновляем, если найдена
            create: {
                name: cat.name
                // parentId: null,  // если нужна иерархия, можно заполнить
            },
        });

        console.log(`Category '${cat.name}' => id=${createdCat.id}`);

        // Теперь обновим каждую настройку (т.е. поле settingCategoryId) для ключей в cat.keys
        if (cat.keys.length > 0) {
            await prisma.setting.updateMany({
                where: { key: { in: cat.keys } },
                data: { settingCategoryId: createdCat.id },
            });
        }
    }

    console.log('Categories created and settings assigned.');

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