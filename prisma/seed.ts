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
        {
            setting_key: "is_set_up",
            setting_value: "false",
            label: "Is site set up",
            description: "Flag indicating whether the initial site setup has been completed. True means the site is fully configured."
        },
        {
            setting_key: "site_name",
            label: "Site name",
            description: "The name of the site that is displayed in the header, footer, and page titles."
        },
        {
            setting_key: "default_language_id",
            label: "Default Language",
            description: "The identifier for the default language used to display content and the user interface on the site."
        },
        {
            setting_key: "timezone",
            label: "Timezone",
            description: "The timezone used by the site for displaying time and date information."
        },
        {
            setting_key: "currency",
            label: "Main currency",
            description: "The primary currency used for processing payments and displaying prices on the site."
        },
        {
            setting_key: "items_per_page",
            label: "Items per page",
            description: "The number of items (e.g., products) displayed on each listing page."
        },
        {
            setting_key: "contact_email",
            label: "Contact email",
            description: "The email address used for site administration, customer support, and general inquiries."
        },
        {
            setting_key: "logo_url",
            label: "Site logo URL",
            description: "The URL of the site logo image that appears in the header and branding sections."
        }
    ]
}

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