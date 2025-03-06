//src/app/api/auth/[...nextauth]
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error("Email and password required")
                }
                // 1) Ищем пользователя
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: {
                        status: true,
                        userRoles: { include: { role: true } },
                    },
                })
                if (!user) {
                    throw new Error("No user found")
                }

                // 2) Проверяем статус
                if (user.status?.name === "banned" || user.status?.name === "suspended") {
                    throw new Error("Your account is not allowed to login")
                }

                // 3) Проверяем пароль
                const isValid = await bcrypt.compare(credentials.password, user.password_hash)
                if (!isValid) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { login_attempts: { increment: 1 } },
                    })
                    throw new Error("Invalid credentials")
                }
                // сбросим login_attempts
                if (user.login_attempts > 0) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { login_attempts: 0, last_login_at: new Date() },
                    })
                }

                // 4) Возвращаем объект, где id => string
                return {
                    id: user.id.toString(),
                    email: user.email,
                    username: user.username,
                    roles: user.userRoles.map((ur) => ur.role.name_tx_id),
                    status: user.status?.name,
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.email = user.email
                token.username = user.username
                token.roles = user.roles
                token.status = user.status
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id!,
                    email: token.email || "",
                    username: token.username,
                    roles: token.roles as number[] || [],
                    status: token.status,
                }
            }
            return session
        },
    },
    pages: {
        signIn: "/login",
    },
}

import NextAuth from "next-auth"

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }