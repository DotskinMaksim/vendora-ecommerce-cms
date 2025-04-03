// src/lib/file-helpers.ts
export function fileToBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (!result || typeof result !== "string") {
                reject(new Error("FileReader error"));
                return;
            }
            const base64Str = result.replace(/^data:.+;base64,/, "");
            resolve(base64Str);
        };
        reader.onerror = () => reject(new Error("FileReader failed"));
        reader.readAsDataURL(file);
    });
}