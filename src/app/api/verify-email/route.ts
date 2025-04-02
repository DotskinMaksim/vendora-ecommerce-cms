// app/api/verify-email/route.ts
import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 })

    const user = await prisma.user.findFirst({
        where: {
            EmailVerificationToken: token,
            EmailVerificationExpires: { gt: new Date() },
        }
    })
    if (!user) {
        return NextResponse.json({ error: "Token invalid or expired" }, { status: 400 })
    }

    // Помечаем как verify
    await prisma.user.update({
        where: { Id: user.Id },
        data: {
            EmailVerified: true,
            EmailVerificationToken: null,
            EmailVerificationExpires: null,
        }
    })
    return NextResponse.json({ message: "Email verified" })
}