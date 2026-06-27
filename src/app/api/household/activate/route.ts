import { auth } from "@/server/better-auth";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const head = await headers();

  const session = await auth.api.getSession({
    headers: head,
  });

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const orgs = await auth.api.listOrganizations({ headers: head });
  if (orgs.length === 0) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  const setOrgResponse = await auth.api.setActiveOrganization({
    headers: head,
    body: {
      organizationId: orgs[0]!.id,
    },
    asResponse: true,
  });

  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  const setCookie = setOrgResponse.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
