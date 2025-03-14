// src/lib/server/image-utils.ts
import path from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";

const ALLOWED_MIME = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
];

export interface ProcessImageOptions {
    /**
     * Макс. размер файла (в байтах)
     */
    maxFileSize: number;

    /**
     * Минимальная сторона (ширина/высота)
     * Если не указано — не проверяем
     */
    minDimension?: number;

    /**
     * Максимальная сторона (ширина/высота)
     * Если не указано — не проверяем
     */
    maxDimension?: number;

    /**
     * Нужно ли генерировать thumbnail
     * Если нужно — укажем размеры
     */
    thumbnail?: {
        width: number;
        height: number;
    };
}

/**
 * Универсальная функция для обработки изображений
 * @param base64 - base64-строка
 * @param options - настройки (maxFileSize, minDimension, maxDimension, thumbnail и т.д.)
 * @returns Возвращает объект с путём к основной картинке и, если нужно, к thumbnail
 */
export async function processImage(
    base64: string,
    options: ProcessImageOptions
): Promise<{ mainUrl: string; thumbUrl?: string }> {
    const { maxFileSize, minDimension, maxDimension, thumbnail } = options;

    // 1) Превращаем base64 в буфер
    const fileBuffer = Buffer.from(base64, "base64");

    // 2) Проверяем общий размер
    if (fileBuffer.length > maxFileSize) {
        throw new Error("File size exceeds limit");
    }

    // 3) Анализируем с помощью sharp
    let image = sharp(fileBuffer, { failOnError: true });
    const metadata = await image.metadata();

    const format = metadata.format; // "png","jpeg","webp","gif"...
    if (!format || !ALLOWED_MIME.includes(`image/${format}`)) {
        throw new Error(`Unsupported format: ${format || "unknown"}`);
    }

    const { width, height } = metadata;
    if (!width || !height) {
        throw new Error("Could not read image dimensions");
    }

    // 4) Если указаны минимальные/максимальные размеры — проверяем
    if (minDimension && (width < minDimension || height < minDimension)) {
        throw new Error(`Image is too small (min ${minDimension}x${minDimension})`);
    }
    // Доп. «страховка» от слишком больших изображений
    if (width > 10000 || height > 10000) {
        throw new Error("Dimensions exceed 10000px, refusing processing!");
    }

    // 5) Удаляем EXIF (sharp по умолчанию чистит многие метаданные, но укажем явно)
    image = image.withMetadata({ density: undefined });

    // 6) Если есть maxDimension и реальное изображение больше — уменьшаем
    if (maxDimension && (width > maxDimension || height > maxDimension)) {
        image = image.resize({
            width: Math.min(width, maxDimension),
            height: Math.min(height, maxDimension),
            fit: "inside",
        });
    }

    // 7) Генерируем имя файла
    const fileName = uuidv4() + "." + format;
    const fullPath = path.join(process.cwd(), "public", "images", fileName);

    // Сохраняем «основное» изображение
    await image.toFile(fullPath);

    // 8) Если нужно сделать thumbnail
    let thumbUrl: string | undefined;
    if (thumbnail) {
        const thumbFileName = uuidv4() + "-thumb." + format;
        const thumbFilePath = path.join(process.cwd(), "public", "images", thumbFileName);

        // thumbnail всегда делаем с исходного буфера (чтобы при желании другая обрезка)
        await sharp(fileBuffer)
            .withMetadata({ density: undefined })
            .resize({
                width: thumbnail.width,
                height: thumbnail.height,
                fit: "inside",
            })
            .toFile(thumbFilePath);

        thumbUrl = "/images/" + thumbFileName;
    }

    return {
        mainUrl: "/images/" + fileName,
        thumbUrl,
    };
}