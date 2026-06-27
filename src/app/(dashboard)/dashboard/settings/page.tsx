import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EditHouseholdForm } from "@/components/dashboard/edit-household-form";
import { InviteMemberSheetDrawer } from "@/components/dashboard/members/invite-member-sheet-drawer";
import { MemberList } from "@/components/dashboard/members/member-list";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Page() {
  return (
    <DashboardPage title="Settings">
      <Card>
        <CardHeader>
          <CardTitle>Household Settings</CardTitle>
          <CardDescription>Edit and manage household settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditHouseholdForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Member Management</CardTitle>
          <CardDescription>
            Add and manage members to your household
          </CardDescription>
          <CardAction>
            <InviteMemberSheetDrawer />
          </CardAction>
        </CardHeader>
        <CardContent>
          <MemberList />
        </CardContent>
      </Card>
    </DashboardPage>
  );
}
