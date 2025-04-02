import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// Настройки NextAuth
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
                    throw new Error("Email and password required");
                }
                // 1) Ищем пользователя
                const user = await prisma.user.findUnique({
                    where: { Email: credentials.email },
                    include: {
                        Status: true,
                        UserRoles: { include: { Role: true } },
                    },
                });
                if (!user) {
                    throw new Error("No user found");
                }

                // 2) Проверяем статус
                if (user.Status?.Name === "banned" || user.Status?.Name === "suspended") {
                    throw new Error("Your account is not allowed to login");
                }

                // 3) Проверяем пароль
                const isValid = await bcrypt.compare(credentials.password, user.PasswordHash);
                if (!isValid) {
                    await prisma.user.update({
                        where: { Id: user.Id },
                        data: { LoginAttempts: { increment: 1 } },
                    });
                    throw new Error("Invalid credentials");
                }
                // сбросим login_attempts
                if (user.LoginAttempts > 0) {
                    await prisma.user.update({
                        where: { Id: user.Id },
                        data: { LoginAttempts: 0, LastLoginAt: new Date() },
                    });
                }

                // 4) Возвращаем объект, где id => string
                return {
                    id: user.Id.toString(),
                    email: user.Email,
                    username: user.Username,
                    roles: user.UserRoles.map((ur) => ur.Role.NameTxId),
                    status: user.Status?.Name,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.username = user.username;
                token.roles = user.roles;
                token.status = user.status;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id!,
                    email: token.email || "",
                    username: token.username,
                    roles: (token.roles as number[]) || [],
                    status: token.status,
                };
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
};

import NextAuth from "next-auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };