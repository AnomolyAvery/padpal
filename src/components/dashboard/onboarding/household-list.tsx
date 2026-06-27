"use client";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/server/better-auth/client";
import { IconHome } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function HouseholdList() {
  const { data: session } = authClient.useSession();
  const { data: households, isPending: isListPending } =
    authClient.useListOrganizations();

  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async (id: string) =>
      authClient.organization.setActive({
        organizationId: id,
      }),
    onSuccess: ({ data, error }) => {
      if (error) {
        toast.error("Failed to set active household", {
          description: error.message,
        });
        return;
      }

      toast.success("Successfully set active household", {
        description: data.name,
      });
      router.push("/dashboard");
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error("Something went wrong!", {
        description: msg,
      });
    },
  });

  function onHouseholdSelect(id: string) {
    if (id === session?.session.activeOrganizationId) {
      router.push("/dashboard");
      return;
    }

    mutate(id);
  }

  if (isListPending || households?.length === 0) {
    return (
      <Empty>
        <EmptyMedia>
          <IconHome />
        </EmptyMedia>
        <EmptyTitle>No households</EmptyTitle>
        <EmptyDescription>
          Create or join a household to get started
        </EmptyDescription>
      </Empty>
    );
  }

  return (
    <div>
      {households?.map((household) => (
        <Card key={household.id}>
          <CardHeader>
            <CardTitle>{household.name}</CardTitle>
            <CardAction>
              <Button
                variant={
                  household.id === session?.session.activeOrganizationId
                    ? "default"
                    : "secondary"
                }
                disabled={isPending}
                onClick={() => onHouseholdSelect(household.id)}
              >
                {isPending && <Spinner />}
                {isPending ? "Selecting..." : "Select"}
              </Button>
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
