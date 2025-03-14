// src/lib/server/image-processor.ts
import { processImage } from "./image-utils";

/**
 * «Простая картинка»:
 * - Макс. размер 5 MB
 * - Без требований к min/maxDimension
 * - Без thumbnail
 */
export async function processGenericImage(base64: string): Promise<string> {
    const { mainUrl } = await processImage(base64, {
        maxFileSize: 5 * 1024 * 1024, // 5 MB
    });
    return mainUrl;
}