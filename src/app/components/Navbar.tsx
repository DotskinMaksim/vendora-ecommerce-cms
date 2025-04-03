"use client"

import { signOut } from "next-auth/react"

export default function Navbar() {
    return (
        <nav style={{ display: "flex", justifyContent: "space-between", padding: "16px", background: "#f8f9fa" }}>
            <span>MyApp</span>
            <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                style={{ padding: "8px 16px", background: "#dc3545", color: "#fff", border: "none", cursor: "pointer" }}
            >
                Log Out
            </button>
        </nav>
    )
}