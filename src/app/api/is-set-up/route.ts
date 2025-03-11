///Users/maksim/WebstormProjects/vendora-ecommerce-cms/src/app/api/is-set-up/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


export async function GET() {
    // тут можно safely использовать prisma
    const isSetUp = await prisma.setting.findUnique({
        where: { setting_key: "is_set_up" },
    })

    if (isSetUp?.setting_value !== "true") {
        return NextResponse.json({ isSetUp: false }, { status: 404 })
    }
    return NextResponse.json({ isSetUp: true })
}