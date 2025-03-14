import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
        return <h2>Please log in</h2>
    }

    return (
        <div>
            <h2>Hello, {session.user.username}!</h2>
            <p>Status: {session.user.status}</p>
            <p>Email: {session.user.email}</p>

        </div>

    )
}