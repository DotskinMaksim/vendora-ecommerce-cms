//src/app/api/settings/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const settings = await prisma.setting.findMany();
        return NextResponse.json(settings);
    } catch (error: any) {
        return new NextResponse(error?.message || "Something went wrong", {
            status: 500,
        });
    }
}