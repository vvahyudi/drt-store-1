import { DefaultSession } from "next-auth"
import NextAuth from "next-auth"

declare module "next-auth" {
	interface User {
		id: string
		name: string
		accessToken: string
		refreshToken: string
	}

	interface Session {
		user: {
			id: string
			name: string
			email?: string
			accessToken: string
			refreshToken: string
		}
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string
		accessToken: string
		refreshToken: string
	}
}
