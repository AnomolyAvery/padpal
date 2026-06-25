import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "./server/better-auth/server";
import { auth } from "./server/better-auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
  const state = await getSession();
  if (!state) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const { session } = state;
  if (!session.activeOrganizationId) {
    const head = await headers();

    const orgs = await auth.api.listOrganizations({
      headers: head,
    });

    if (orgs.length === 0) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    const org = orgs[0]!;
    await auth.api.setActiveOrganization({
      headers: head,
      body: {
        organizationId: org.id,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
