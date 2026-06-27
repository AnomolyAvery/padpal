import { DashboardSidebar } from "@/components/dashboard/sidebar/dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { dashboardMetadata } from "@/lib/metadata";
import { auth } from "@/server/better-auth";
import { getSession } from "@/server/better-auth/server";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

export const metadata: Metadata = dashboardMetadata;

async function getFullOrg(orgId: string) {
  const org = await auth.api.getFullOrganization({
    headers: await headers(),
    query: {
      organizationId: orgId,
    },
  });

  return org;
}

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const state = await getSession();
  if (!state) {
    redirect("/sign-in");
  }

  const { session, user } = state;

  if (!session.activeOrganizationId) {
    redirect("/onboarding?mode=create");
  }

  const org = await getFullOrg(session.activeOrganizationId);
  if (!org) {
    throw new Error(
      "Household not found. Please contact support if this continues.",
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <DashboardSidebar org={org} user={user} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
