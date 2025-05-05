import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
	const token = await getToken({ req: request })
	const path = request.nextUrl.pathname

	if (!token && path !== "/login") {
		return NextResponse.redirect(new URL("/login", request.url))
	}

	if (token && path === "/login") {
		return NextResponse.redirect(new URL("/admin/dashboard", request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/login", "/admin/:path*"],
}
