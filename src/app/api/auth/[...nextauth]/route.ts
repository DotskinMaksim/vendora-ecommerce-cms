import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/server/prisma";
import bcrypt from "bcrypt";

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

                // Ищем пользователя по полю `email` (в схеме: user.email)
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: {
                        // Поле `status` вместо `Status`
                        status: true,
                        // Поле `userRoles` вместо `UserRoles`
                        userRoles: { include: { role: true } },
                    },
                });
                if (!user) {
                    throw new Error("No user found");
                }

                // Проверка статуса: user.status?.name
                if (user.status?.name === "banned" || user.status?.name === "suspended") {
                    throw new Error("Your account is not allowed to login");
                }

                // Сравниваем пароль (user.passwordHash)
                const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!isValid) {
                    // Увеличиваем счётчик loginAttempts
                    await prisma.user.update({
                        where: { id: user.id }, // поле `id` (строчной)
                        data: { loginAttempts: { increment: 1 } }, // поле `loginAttempts`
                    });
                    throw new Error("Invalid credentials");
                }

                // сбрасываем loginAttempts
                if (user.loginAttempts > 0) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            loginAttempts: 0,
                            lastLoginAt: new Date(), // поле `lastLoginAt`
                        },
                    });
                }

                // Возвращаем объект для jwt
                return {
                    id: user.id.toString(),
                    email: user.email,
                    username: user.username,
                    // теперь user.userRoles -> ur.role (строчные)
                    roles: user.userRoles.map((ur) => ur.role.nameTxId),
                    status: user.status?.name,
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