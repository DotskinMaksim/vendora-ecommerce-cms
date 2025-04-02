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

        // Используем имена полей, как они определены в Prisma (с заглавными буквами)
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ Email: email }, { Username: username }],
            },
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    error:
                        existingUser.Email === email
                            ? "Email already in use"
                            : "Username already in use",
                },
                { status: 400 }
            );
        }

        // Хешируем пароль (например, 10 раундов)
        const hashed = await bcrypt.hash(password, 10);

        // Создаём пользователя, используя корректные имена полей
        const newUser = await prisma.user.create({
            data: {
                Email: email,
                Username: username,
                PasswordHash: hashed,
                // Если нужно, можно указать и статус, например: StatusId: 2,
            },
        });

        return NextResponse.json({ userId: newUser.Id }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}