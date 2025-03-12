// app/api/setup/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const settingsToUpdate = [
            { key: "site_name", value: body.siteName },
            { key: "contact_email", value: body.contactEmail },
            { key: "timezone", value: body.timezone },
            { key: "currency", value: body.currency },
            { key: "registration_enabled", value: body.isRegistrationEnabled ? "true" : "false" },
            { key: "auto_login_enabled", value: body.autoLoginEnabled ? "true" : "false" },
            { key: "is_set_up", value: "true" }, // Устанавливаем is_set_up последним действием
        ]

        await prisma.$transaction(async (tx) => {
            for (const setting of settingsToUpdate) {
                await tx.setting.update({
                    where: { setting_key: setting.key },
                    data: { setting_value: setting.value },
                })
            }
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Error in POST /api/setup:", error)
        return new NextResponse(error.message || "Internal Server Error", { status: 500 })
    }
}