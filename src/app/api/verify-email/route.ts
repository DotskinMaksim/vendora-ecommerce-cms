// app/api/verify-email/route.ts
import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 })

    const user = await prisma.user.findFirst({
        where: {
            email_verification_token: token,
            email_verification_expires: { gt: new Date() },
        }
    })
    if (!user) {
        return NextResponse.json({ error: "Token invalid or expired" }, { status: 400 })
    }

    // Помечаем как verify
    await prisma.user.update({
        where: { id: user.id },
        data: {
            email_verified: true,
            email_verification_token: null,
            email_verification_expires: null,
        }
    })
    return NextResponse.json({ message: "Email verified" })
}