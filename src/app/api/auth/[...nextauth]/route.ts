import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { authAPI } from "@/lib/api"

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.username || !credentials?.password) {
					throw new Error("Username and password are required")
				}

				try {
					const response = await authAPI.login(
						credentials.username,
						credentials.password,
					)

					if (response.status === 200 && response.data) {
						return {
							id: response.data.username, // Using username as ID since backend doesn't provide user ID
							name: response.data.username,
							accessToken: response.data.access_token,
							refreshToken: response.data.refresh_token,
						}
					}
					throw new Error("Invalid credentials")
				} catch (error: any) {
					console.error("Login error:", error)
					throw new Error(
						error.response?.data?.message || "Authentication failed",
					)
				}
			},
		}),
	],
	pages: {
		signIn: "/login",
		error: "/login",
	},
	callbacks: {
		async jwt({ token, user, trigger }) {
			if (user) {
				token.id = user.id
				token.accessToken = user.accessToken
				token.refreshToken = user.refreshToken
			}

			// Handle token refresh
			if (trigger === "update" && token.refreshToken) {
				try {
					const response = await authAPI.refreshToken(
						token.refreshToken as string,
					)
					if (response.status === 200 && response.data) {
						token.accessToken = response.data.access_token
						token.refreshToken = response.data.refresh_token
					}
				} catch (error) {
					console.error("Token refresh error:", error)
				}
			}

			return token
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string
				session.user.accessToken = token.accessToken as string
				session.user.refreshToken = token.refreshToken as string
			}
			return session
		},
	},
	session: {
		strategy: "jwt",
		maxAge: 60 * 60, // 1 hour
	},
	debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }
