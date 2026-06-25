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

export function DashboardSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <HouseholdSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <DashboardNavMain />
        <DashboardNavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <DashboardUser />
      </SidebarFooter>
    </Sidebar>
  );
}
