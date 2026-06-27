import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./server/better-auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
  const state = await auth.api.getSession({
    headers: await headers(),
  });

  if (!state) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const { session } = state;
  if (!session.activeOrganizationId) {
    const head = await headers();
    const orgs = await auth.api.listOrganizations({ headers: head });

    if (orgs.length === 0) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    const org = orgs[0]!;

    // Call setActiveOrganization and capture the raw Response
    const setOrgResponse = await auth.api.setActiveOrganization({
      headers: head,
      body: { organizationId: org.id },
      asResponse: true, // <-- get the raw Response to extract Set-Cookie
    });

    const next = NextResponse.next();

    // Forward any Set-Cookie headers back to the browser
    const setCookie = setOrgResponse.headers.get("set-cookie");
    if (setCookie) {
      next.headers.set("set-cookie", setCookie);
    }

    return next;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
