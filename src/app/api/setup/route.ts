import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
    try {
        const { siteName, adminEmail, adminPassword } = await req.json()
        if (!siteName || !adminEmail || !adminPassword) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        // 1) Проверяем is_set_up
        const isSetUp = await prisma.setting.findUnique({
            where: { setting_key: "is_set_up" },
        })
        if (isSetUp?.setting_value === "true") {
            return NextResponse.json({ error: "Site is already set up" }, { status: 403 })
        }

        // 2) Создаём админа
        const existingAdmin = await prisma.user.findFirst({
            where: { OR: [{ email: adminEmail }, { username: "admin" }] }
        })
        if (existingAdmin) {
            return NextResponse.json({ error: "Admin email or username is in use" }, { status: 400 })
        }

        const hashedPass = await bcrypt.hash(adminPassword, 10)
        const newAdmin = await prisma.user.create({
            data: {
                email: adminEmail,
                username: "admin",
                password_hash: hashedPass,
                // Если есть логика статусов, можно задать status_id...
                // status_id: 2 (например, active)
            },
        })

        // 3) Записываем siteName
        await prisma.setting.update({
            where: { setting_key: "site_name" },
            data: {
                setting_value: siteName,
            }
        })

        // 4) Ставим is_set_up = true
        await prisma.setting.update({
            where: { setting_key: "is_set_up" },
            data: { setting_value: "true" },
        })

        return NextResponse.json({ message: "Setup complete" })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}