// src/app/api/setup/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
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
            // Устанавливаем setup_completed
            { key: "setup_completed", value: "true" },
        ];

        await prisma.$transaction(async (tx) => {
            for (const item of settingsToUpdate) {
                await tx.setting.update({
                    where: { key: item.key },     // строчное
                    data: { value: item.value },  // строчное
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