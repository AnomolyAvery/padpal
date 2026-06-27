import type { ComponentProps } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "../../ui/sidebar";
import { DashboardUser } from "./dashboard-user";
import { DashboardNavMain, DashboardNavSecondary } from "./dashboard-nav";
import { HouseholdSwitcher } from "./household-switcher";
import type { User } from "better-auth";
import type { Organization } from "better-auth/plugins/organization";

interface DashboardSidebarProps extends ComponentProps<typeof Sidebar> {
  user: User;
  org: Organization;
}

export function DashboardSidebar({
  user,
  org,
  ...props
}: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <HouseholdSwitcher active={org} />
      </SidebarHeader>
      <SidebarContent>
        <DashboardNavMain />
        <DashboardNavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <DashboardUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
