"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { authClient } from "@/server/better-auth/client";
import { IconDotsVertical, IconTrash, IconUsers } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import type { Member } from "better-auth/plugins/organization";
import { useState } from "react";
import { toast } from "sonner";
import { RemoveMemberDialog } from "./remove-member-dialog";

const ROLE_LABELS: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function MemberList() {
  const [pendingRemoval, setPendingRemoval] = useState<
    | (Member & {
        user: {
          id: string;
          email: string;
          name: string;
          image?: string | null;
        };
      })
    | null
  >(null);

  const { data: session } = authClient.useSession();

  const { data: list, refetch: refetchList } = useQuery({
    queryKey: ["household", "members"],
    queryFn: () => authClient.organization.listMembers(),
  });

  const members = list?.data?.members ?? [];

  return (
    <>
      {members.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant={"icon"}>
              <IconUsers />
            </EmptyMedia>
            <EmptyTitle>No members yet</EmptyTitle>
            <EmptyDescription>Invite someone to get started.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {members.map((member) => (
            <Card
              key={member.id}
              className={cn(
                member.userId === session?.user.id && "bg-muted/50",
              )}
            >
              <CardHeader className="relative">
                <div className="flex min-w-0 flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">
                        {getInitials(member.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="flex items-center gap-3 truncate text-sm">
                        <span>{member.user.name}</span>
                        {member.userId === session?.user.id && (
                          <Badge
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            You
                          </Badge>
                        )}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="shrink-0 text-xs capitalize"
                      >
                        {ROLE_LABELS[member.role] ?? member.role}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="truncate">
                    {member.user.email}
                  </CardDescription>
                </div>
                <CardAction>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <IconDotsVertical className="h-4 w-4" />
                        <span className="sr-only">Member options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-64">
                      <DropdownMenuItem
                        disabled={
                          member.userId === session?.user.id ||
                          member.role === "owner"
                        }
                        className="text-destructive focus:text-destructive"
                        onSelect={() => setPendingRemoval(member)}
                      >
                        <IconTrash className="mr-2 h-4 w-4" />
                        Remove member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardAction>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <RemoveMemberDialog
        member={pendingRemoval}
        onClose={() => {
          setPendingRemoval(null);
          refetchList().catch((err: Error) => {
            const msg = err?.message ?? "An unknown error occurred";
            toast.error("Failed to fetch member list", {
              description: msg,
            });
          });
        }}
      />
    </>
  );
}
