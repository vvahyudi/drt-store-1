import { DefaultSession } from "next-auth"
import NextAuth from "next-auth"

declare module "next-auth" {
	interface User {
		id: string
		username: string

		accessToken: string
		refreshToken: string
	}

	interface Session {
		user: {
			id: string
			username: string

			accessToken: string
			refreshToken: string
		}
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string
		username: string

		accessToken: string
		refreshToken: string
	}
}
