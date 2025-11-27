import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  //return NextResponse.next()

  // allow login page and API routes
  if (pathname.startsWith("/auth") || pathname.startsWith("/api") || pathname.startsWith("/home")) {
    return NextResponse.next()
  }

  // check if user is authenticated
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    const loginUrl = new URL("/auth/login", req.url)
    loginUrl.searchParams.set("callbackUrl", req.url) // redirect back after login
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// apply middleware to everything except static assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}