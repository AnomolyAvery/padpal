import { CreateHouseholdForm } from "@/components/dashboard/onboarding/create-household-form";
import { HouseholdList } from "@/components/dashboard/onboarding/household-list";
import { JoinHouseholdForm } from "@/components/dashboard/onboarding/join-household-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconHomeDollar } from "@tabler/icons-react";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{
    mode?: string;
    inviteCode?: string;
  }>;
}
export default async function Page({ searchParams }: PageProps) {
  const search = await searchParams;
  const mode = search.mode ?? "create";
  const inviteCode = search.inviteCode;

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <IconHomeDollar className="size-4" />
            </div>
            PadPal
          </Link>
        </div>
        <div className="flex h-full flex-1 items-center justify-center">
          <div className="w-full max-w-md flex-1 space-y-6">
            <Tabs defaultValue={mode} className="w-full space-y-6">
              <TabsList>
                <TabsTrigger value="create">Create</TabsTrigger>
                <TabsTrigger value="join">Join</TabsTrigger>
                <TabsTrigger value="list">My Households</TabsTrigger>
              </TabsList>
              <TabsContent value="create">
                <CreateHouseholdForm />
              </TabsContent>
              <TabsContent value="join">
                <JoinHouseholdForm inviteCode={inviteCode} />
              </TabsContent>
              <TabsContent value="list">
                <HouseholdList />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src={
            "https://www.godwinvaapts.com/wp-content/uploads/2022/06/lewisRender2.jpg"
          }
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
