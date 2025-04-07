// src/app/(site)/layout.tsx
import { prisma } from "@/lib/server/prisma"
import { redirect } from "next/navigation"
import Navbar from "@/components/Navbar";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
    const setting = await prisma.setting.findUnique({
        where: { key: "setup_completed" },
    })
    const isSetUp = (setting?.value === "true")

    if (!isSetUp) {
        redirect("/setup")
    }

    return (
        <>
            <Navbar />
            {children}
        </>
    )
}
