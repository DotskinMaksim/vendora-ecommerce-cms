import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { RegisterDto } from "@/dtos/auth.dto";

export async function POST(req: Request) {
    try {
        // Явно типизируем тело запроса как RegisterDto
        const { email, username, password } = (await req.json()) as RegisterDto;

        if (!email || !username || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    error:
                        existingUser.email === email
                            ? "Email already in use"
                            : "Username already in use",
                },
                { status: 400 }
            );
        }
        // Хешируем пароль (например, 10 раундов)
        const hashed = await bcrypt.hash(password, 10);

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
        });

        return NextResponse.json({ userId: newUser.id }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}