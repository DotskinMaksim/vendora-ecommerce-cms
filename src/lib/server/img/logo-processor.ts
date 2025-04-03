// src/lib/server/logo-processor.ts
import { processImage } from "./image-utils";

/**
 * «Лого»:
 * - Макс. размер 2 MB
 * - Ограничения: минимум 50×50, максимум 300×300
 * - Плюс создаём thumbnail (100×100)
 */
export async function processLogo(base64: string): Promise<{
    mainUrl: string;
    thumbUrl: string;
}> {
    const { mainUrl, thumbUrl } = await processImage(base64, {
        maxFileSize: 2 * 1024 * 1024, // 2 MB
        minDimension: 50,
        maxDimension: 300,
        thumbnail: {
            width: 100,
            height: 100,
        },
    });

    if (!thumbUrl) {
        throw new Error("Thumbnail was not generated"); // На всякий случай
    }

    return { mainUrl, thumbUrl };
}