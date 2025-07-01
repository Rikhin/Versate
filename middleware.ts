import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function middleware(req: NextRequest) {
  const { userId } = await auth();
  const url = req.nextUrl.clone();

  // Allow public pages and onboarding
  if (
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up") ||
    url.pathname.startsWith("/onboarding") ||
    url.pathname === "/"
  ) {
    return NextResponse.next();
  }

  // If not signed in, redirect to sign-in
  if (!userId) {
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files, sign-in, sign-up, onboarding, and root.
    "/((?!_next/static|_next/image|favicon.ico|sign-in|sign-up|onboarding|$).*)",
  ],
};
