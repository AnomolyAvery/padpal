"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Member } from "better-auth/plugins/organization";
import { useState } from "react";
import { toast } from "sonner";

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

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) =>
      authClient.organization.removeMember({
        memberIdOrEmail: id,
      }),
    onSuccess: async () => {
      toast.success("Member successfully removed");
      setPendingRemoval(null);
      await refetchList();
    },
    onError: (err) => {
      toast.error("Failed to remove member!", {
        description: err.message,
      });
    },
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
                    <DropdownMenuContent align="end">
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
      <AlertDialog
        open={!!pendingRemoval}
        onOpenChange={(open) => !open && setPendingRemoval(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{pendingRemoval?.user.name}</strong> will lose access to
              this household. You can invite them again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
              onClick={() => pendingRemoval && mutateAsync(pendingRemoval.id)}
            >
              {isPending ? "Removing…" : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
