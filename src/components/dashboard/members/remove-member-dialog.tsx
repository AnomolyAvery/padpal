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
import { authClient } from "@/server/better-auth/client";
import { useMutation } from "@tanstack/react-query";
import type { Member } from "better-auth/plugins/organization";
import { toast } from "sonner";

interface RemoveMemberDialogProps {
  member:
    | (Member & {
        user: {
          id: string;
          email: string;
          name: string;
          image?: string | null;
        };
      })
    | null;
  onClose?: () => void;
}

export function RemoveMemberDialog({
  member,
  onClose,
}: RemoveMemberDialogProps) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) =>
      authClient.organization.removeMember({
        memberIdOrEmail: id,
      }),
    onSuccess: async () => {
      toast.success("Member successfully removed");
      if (onClose) {
        onClose();
      }
    },
    onError: (err) => {
      toast.error("Failed to remove member!", {
        description: err.message,
      });
    },
  });

  return (
    <AlertDialog
      open={!!member}
      onOpenChange={(open) => {
        if (!open && onClose) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove member?</AlertDialogTitle>
          <AlertDialogDescription>
            <strong>{member?.user.name}</strong> will lose access to this
            household. You can invite them again later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isPending}
            onClick={() => member && mutateAsync(member.id)}
          >
            {isPending ? "Removing…" : "Remove"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
