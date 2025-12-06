import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Admin-only routes
    if (req.nextUrl.pathname.startsWith("/kullanicilar")) {
      const token = req.nextauth.token;
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projeler/:path*",
    "/musteriler/:path*",
    "/raporlar/:path*",
    "/finans/:path*",
    "/takvim/:path*",
    "/ekipman/:path*",
    "/ayarlar/:path*",
    "/kullanicilar/:path*",
  ],
};
