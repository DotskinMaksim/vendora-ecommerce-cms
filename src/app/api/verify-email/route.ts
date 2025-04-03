// drc/app/api/verify-email/route.ts
import {NextResponse} from "next/server";
import {prisma} from "@/lib/server/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 })

    const user = await prisma.user.findFirst({
        where: {
            emailVerificationToken: token,            // строчное название
            emailVerificationExpires: { gt: new Date() },
        },
    });
    if (!user) {
        return NextResponse.json({ error: "Token invalid or expired" }, { status: 400 });
    }
    await prisma.user.update({
        where: { id: user.id }, // строчное
        data: {
            emailVerified: true,            // строчное
            emailVerificationToken: null,
            emailVerificationExpires: null,
        },
    });
    return NextResponse.json({ message: "Email verified" })
}