// app/setup/layout.tsx
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function SetupLayout({ children }: { children: React.ReactNode }) {
    const setting = await prisma.setting.findUnique({
        where: { setting_key: "is_set_up" },
    });
    const isSetUp = setting?.setting_value === "true";

    if (isSetUp) {
        const headersList = await headers(); // Дожидаемся результата
        const referer = headersList.get("referer") || "/";
        redirect(referer);
    }

    return (
        <>
            {children}
        </>
    );
}