import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./server/better-auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
  const head = await headers();
  const state = await auth.api.getSession({ headers: head });

  if (!state) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (!state.session.activeOrganizationId) {
    // Delegate cookie-setting + redirect to the API route
    // which can correctly attach Set-Cookie to a redirect response
    return NextResponse.redirect(
      new URL("/api/household/activate", request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
