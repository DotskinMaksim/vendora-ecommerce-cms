// types/next-auth.d.ts
import { DefaultUser, DefaultSession } from "next-auth"

declare module "next-auth" {
    // Расширяем интерфейс User, который возвращается в authorize()
    interface User extends DefaultUser {
        id: string           // теперь точно строка
        username?: string
        roles?: number[]
        status?: string
    }

    // Расширяем интерфейс Session, который доступен на клиенте
    interface Session {
        user?: {
            id: string
            username?: string
            roles?: number[]
            status?: string
        } & DefaultSession["user"]
    }
}

// Если используете JWT коллбэки, можно дополнить:
declare module "next-auth/jwt" {
    interface JWT {
        id?: string
        username?: string
        roles?: number[]
        status?: string
    }
}