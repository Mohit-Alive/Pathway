import { clerkMiddleware } from "@clerk/nextjs/server";

// Next.js 16 renamed `middleware.ts` to `proxy.ts`. This file ONLY attaches
// the Clerk session to the request — it does not authorize anything.
// Per the Next 16 docs, Server Functions are POST-reachable at their own
// route regardless of this matcher, so every DAL function must call
// requireUser() itself. Route/layout guards here are UX, not security.
//
// Do NOT add `export const runtime` here — proxy is Node-only in Next 16
// and setting `runtime` throws.
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next internals and static files, unless present in search params.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes.
    "/(api|trpc)(.*)",
    // Always run for Clerk's own frontend API proxying.
    "/__clerk/(.*)",
  ],
};
