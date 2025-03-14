// app/api/setup/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SetupDto } from "@/dtos/setting.dto";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as SetupDto;

        const settingsToUpdate = [
            { key: "site_name", value: body.siteName },
            { key: "contact_email", value: body.contactEmail },
            { key: "timezone", value: body.timezone },
            { key: "currency", value: body.currency },
            {
                key: "registration_enabled",
                value: body.isRegistrationEnabled ? "true" : "false",
            },
            {
                key: "auto_login_enabled",
                value: body.autoLoginEnabled ? "true" : "false",
            },
            // Новая настройка (logo_url)
            { key: "logo_url", value: body.logoUrl || "" },
            // Устанавливаем is_set_up
            { key: "is_set_up", value: "true" },
        ];

        await prisma.$transaction(async (tx) => {
            for (const setting of settingsToUpdate) {
                await tx.setting.update({
                    where: { setting_key: setting.key },
                    data: { setting_value: setting.value },
                });
            }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error in POST /api/setup:", error);
        return new NextResponse(error.message || "Internal Server Error", {
            status: 500,
        });
    }
}