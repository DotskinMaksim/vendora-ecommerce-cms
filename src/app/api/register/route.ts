import { prisma } from "@/lib/server/prisma";
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
            // Проверяем: existingUser.email === email
            if (existingUser.email === email) {
                return NextResponse.json(
                    { error: "Email already in use" },
                    { status: 400 }
                );
            } else {
                return NextResponse.json(
                    { error: "Username already in use" },
                    { status: 400 }
                );
            }
        }

        const hashed = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                passwordHash: hashed,
            },
        });
        return NextResponse.json({ userId: newUser.id }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}