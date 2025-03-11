import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
    try {
        const { siteName, contactEmail, timezone, currency } = await req.json()

        // Обновляем настройки
        await prisma.setting.updateMany({
            data: { setting_value: siteName || "" },
            where: { setting_key: "site_name" },
        })

        await prisma.setting.updateMany({
            data: { setting_value: contactEmail || "" },
            where: { setting_key: "contact_email" },
        })

        await prisma.setting.updateMany({
            data: { setting_value: timezone || "" },
            where: { setting_key: "timezone" },
        })

        await prisma.setting.updateMany({
            data: { setting_value: currency || "" },
            where: { setting_key: "currency" },
        })

        // Ставим флаг is_set_up = true
        await prisma.setting.update({
            data: { setting_value: "true" },
            where: { setting_key: "is_set_up" },
        })

        return NextResponse.json({ status: "ok" })
    } catch (error: any) {
        console.error("Setup error:", error)
        return new NextResponse(error?.message || "Internal error", { status: 500 })
    }
}