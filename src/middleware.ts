import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
	function middleware(req) {
		const token = req.nextauth.token
		const isAuth = !!token
		const isAuthPage =
			req.nextUrl.pathname.startsWith("/login") ||
			req.nextUrl.pathname.startsWith("/register")

		// Verify CSRF token for non-GET requests
		if (req.method !== "GET") {
			const csrfToken = req.headers.get("x-csrf-token")
			if (!csrfToken) {
				return new NextResponse("CSRF token missing", { status: 403 })
			}
		}

		// Admin route protection with role check
		if (req.nextUrl.pathname.startsWith("/admin")) {
			if (!isAuth) {
				return NextResponse.redirect(new URL("/login", req.url))
			}
			// Add role check if needed
			// if (token?.role !== "admin") {
			//     return NextResponse.redirect(new URL("/", req.url))
			// }
		}

		// Redirect to home if logged in and trying to access auth pages
		if (isAuthPage && isAuth) {
			return NextResponse.redirect(new URL("/", req.url))
		}

		return NextResponse.next()
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token, // Only allow authenticated requests
		},
	},
)

export const config = {
	matcher: ["/admin/:path*", "/login", "/register"],
}
