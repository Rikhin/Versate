import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Match all routes except static files, sign-in, sign-up, and root.
    "/((?!_next/static|_next/image|favicon.ico|sign-in|sign-up|$).*)",
  ],
};
