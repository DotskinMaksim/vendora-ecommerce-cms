import { NextResponse } from "next/server"
import {prisma} from "@/lib/prisma" // Предположим, вы экспортируете сконфигурированный Prisma клиент

// В Next.js 13+ (route handlers):
export async function GET() {
    try {
        // Допустим, нам нужны все настройки, у которых есть description и label
        const settings = await prisma.setting.findMany()
        return NextResponse.json(settings)
    } catch (error: any) {
        return new NextResponse(error?.message || "Something went wrong", { status: 500 })
    }
}