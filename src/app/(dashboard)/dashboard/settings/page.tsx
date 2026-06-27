import { DashboardPage } from "@/components/dashboard/dashboard-page";
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

export default function Page() {
  return (
    <DashboardPage title="Settings">
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
