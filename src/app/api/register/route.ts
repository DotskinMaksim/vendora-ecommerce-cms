// app/api/register/route.ts
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
    try {
        const { email, username, password } = await req.json()
        if (!email || !username || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }
        // Проверим, нет ли такого email
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })
        if (existingUser) {
            return NextResponse.json({ error: "Email already in use" }, { status: 400 })
        }
        // Хешируем пароль (например, 10 раундов)
        const hashed = await bcrypt.hash(password, 10)

        // Создаём пользователя
        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                password_hash: hashed,
                // Если статус_id не указан, триггер может выставить default_status
                // Или укажем вручную, если нужно:
                // status_id: 2 (к примеру, "pending")...
            },
        })

        return NextResponse.json({ userId: newUser.id }, { status: 201 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}