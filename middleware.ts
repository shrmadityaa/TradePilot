export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/stocks/:path*", "/admin/:path*", "/portfolio/:path*", "/analytics/:path*", "/alerts/:path*", "/reports/:path*", "/learn/:path*"]
};
