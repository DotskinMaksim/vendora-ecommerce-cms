// src/app/api/is-set-up/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/server/prisma"


export async function GET() {
    // тут можно safely использовать prisma
    // GET /api/is-set-up
    const isSetUp = await prisma.setting.findUnique({
        where: { key: "setup_completed" },    // поле "key" строчными
    });
    if (isSetUp?.value !== "true") {   // поле "value" строчными
        return NextResponse.json({ isSetUp: false }, { status: 404 });
    }
    return NextResponse.json({ isSetUp: true });
}