// src/app/api/upload-logo/route.ts
import { NextResponse } from "next/server";
import { processLogo } from "@/lib/server/logo-processor";

export async function POST(request: Request) {
    try {
        const { fileBase64 } = await request.json();

        if (!fileBase64) {
            return NextResponse.json({ error: "Missing fileBase64" }, { status: 400 });
        }

        const { mainUrl, thumbUrl } = await processLogo(fileBase64);
        return NextResponse.json({ url: mainUrl, thumbnail: thumbUrl }, { status: 201 });
    } catch (err: any) {
        console.error("Error in upload-logo:", err);
        return NextResponse.json(
            { error: err.message || "Server error" },
            { status: 500 }
        );
    }
}