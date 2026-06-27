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
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/server/better-auth/client";
import { IconChevronDown, IconPlus } from "@tabler/icons-react";
import type { Organization } from "better-auth/plugins/organization";
import Link from "next/link";

interface HouseholdSwitcherProps {
  active: Organization;
}
export function HouseholdSwitcher({ active }: HouseholdSwitcherProps) {
  const { isPending } = authClient.useSession();
  const { data: households } = authClient.useListOrganizations();
  const { isMobile } = useSidebar();

  if (isPending) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <Skeleton className="size-8 rounded-full" />
            <div className="grid flex-1 gap-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

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
            {households?.map((household) => (
              <DropdownMenuItem key={household.id} className="gap-2 p-2">
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
            <DropdownMenuItem className="gap-2 p-2" asChild>
              <Link href={"/onboarding?mode=create"}>
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <IconPlus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  Add household
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
