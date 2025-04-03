// src/app/api/upload-image/route.ts
import { NextResponse } from "next/server";
import { processGenericImage } from "@/lib/server/img/image-processor";

export async function POST(request: Request) {
    try {
        const { fileBase64 } = await request.json();

        if (!fileBase64) {
            return NextResponse.json({ error: "Missing fileBase64" }, { status: 400 });
        }

        const url = await processGenericImage(fileBase64);
        return NextResponse.json({ url }, { status: 201 });
    } catch (err: any) {
        console.error("Error in upload-image:", err);
        return NextResponse.json(
            { error: err.message || "Server error" },
            { status: 500 }
        );
    }
}