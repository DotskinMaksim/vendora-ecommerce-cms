// app/(site)/layout.tsx
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Navbar from "@/app/(site)/components/Navbar";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
    const setting = await prisma.setting.findUnique({
        where: { setting_key: "is_set_up" },
    })
    const isSetUp = (setting?.setting_value === "true")

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
