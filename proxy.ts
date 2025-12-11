 import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define role-based protected routes
const adminRoutes = ["/dashboard/admin", "/api/users", "/api/parcels"];
const agentRoutes = ["/dashboard/agent", "/api/parcels/assigned"];
const customerRoutes = ["/dashboard/customer", "/parcels/create"];

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const url = req.nextUrl.clone();

  // Not logged in → redirect to login 
  if (!token) {
    if (
      [...adminRoutes, ...agentRoutes, ...customerRoutes].some((r) =>
        req.nextUrl.pathname.startsWith(r)
      )
    ) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const role = token.role;

  // Admin routes
  if (adminRoutes.some((r) => req.nextUrl.pathname.startsWith(r))) {
    if (role !== "admin") {
      url.pathname = "/dashboard/customer"; // Redirect unauthorized
      return NextResponse.redirect(url);
    }
  }

  // Agent routes
  if (agentRoutes.some((r) => req.nextUrl.pathname.startsWith(r))) {
    if (role !== "agent") {
      url.pathname = "/dashboard/customer";
      return NextResponse.redirect(url);
    }
  }

  // Customer routes
  if (customerRoutes.some((r) => req.nextUrl.pathname.startsWith(r))) {
    if (role !== "customer") {
      url.pathname = "/dashboard/admin"; // Redirect others to admin
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Apply middleware to all dashboard and api routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/users/:path*",
    "/api/parcels/:path*",
    "/parcels/create",
  ],
};
