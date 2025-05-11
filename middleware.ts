import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Skip middleware for API routes and static files
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.startsWith("/static") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Get the token from the cookies
  const supabaseSession = request.cookies.get("sb-session")

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/supabase-status"]

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) => path === route || path.startsWith(route + "/"))

  // If the route is not public and there's no session, redirect to login
  if (!isPublicRoute && !supabaseSession) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the route is login and there's a session, redirect to dashboard
  if (path === "/login" && supabaseSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
