"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  IconCirclePlusFilled,
  IconCreditCardHand,
  IconHelp,
  IconLayoutDashboard,
  IconMail,
  IconSettings,
} from "@tabler/icons-react";
import Link from "next/link";
import type { ComponentProps } from "react";

const NAV_MAIN = [
  {
    name: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/dashboard",
  },
  {
    name: "Expenses",
    icon: IconCreditCardHand,
    href: "/dashboard/expenses",
  },
];

export function DashboardNavMain() {
  const { setOpenMobile } = useSidebar();

  function onLinkClick() {
    setOpenMobile(false);
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {NAV_MAIN.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton tooltip={item.name} asChild>
                <Link href={item.href} onClick={onLinkClick}>
                  {item.icon && <item.icon />}
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

const NAV_SECONDARY = [
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: IconSettings,
  },
  {
    name: "Get Help",
    href: "/dashboard/help",
    icon: IconHelp,
  },
];

export function DashboardNavSecondary({
  ...props
}: ComponentProps<typeof SidebarGroup>) {
  const { setOpenMobile } = useSidebar();

  function onLinkClick() {
    setOpenMobile(false);
  }

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {NAV_SECONDARY.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link href={item.href} onClick={onLinkClick}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
