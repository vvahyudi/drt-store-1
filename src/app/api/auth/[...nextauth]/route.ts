import NextAuth, { AuthOptions, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const authOptions: AuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credential",
			credentials: {
				username: {
					label: "username",
					type: "username",
					placeholder: "Enter username...",
				},
				password: {
					label: "Password",
					type: "password",
					placeholder: "Enter Password...",
				},
			},
			async authorize(credentials) {
				if (!credentials?.username || !credentials?.password) return null

				try {
					const response = await axios.post(`${API_URL}/auth/login`, {
						username: credentials.username,
						password: credentials.password,
					})

					if (response.data.data) {
						return {
							id: response.data.data.id,
							username: response.data.data.username || "",
							accessToken: response.data.data.access_token,
							refreshToken: response.data.data.refresh_token,
						} as User
					}
					return null
				} catch (error) {
					return null
				}
			},
		}),
	],
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id
				token.username = (user as any).username
				token.accessToken = (user as any).accessToken
				token.refreshToken = (user as any).refreshToken
			}
			return token
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id as string
				session.user.username = token.username as string

				session.user.accessToken = token.accessToken as string
				session.user.refreshToken = token.refreshToken as string
			}
			return session
		},
	},
	pages: {
		signIn: "/login",
		error: "/login",
	},
	secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
