"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/server/better-auth/client";
import { IconChevronDown, IconPlus } from "@tabler/icons-react";

export function HouseholdSwitcher() {
  const { data: active } = authClient.useActiveOrganization();
  const { data: households } = authClient.useListOrganizations();
  const { isMobile } = useSidebar();

  if (!active) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="aspect-square size-8">
                <AvatarFallback>{active.name.substring(0, 2)}</AvatarFallback>
                {active.logo && (
                  <AvatarImage src={active.logo} alt={active.name} />
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{active.name}</span>
                <span className="truncate text-xs">{active.slug}</span>
              </div>
              <IconChevronDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Households
            </DropdownMenuLabel>
            {households?.map((household, index) => (
              <DropdownMenuItem key={household.name} className="gap-2 p-2">
                <Avatar>
                  <AvatarFallback>
                    {household.name.substring(0, 2)}
                  </AvatarFallback>
                  {household.logo && (
                    <AvatarImage src={household.logo} alt={household.name} />
                  )}
                </Avatar>
                {household.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <IconPlus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Add household
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
