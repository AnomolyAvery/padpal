import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ExpenseSheetDrawer } from "@/components/dashboard/expenses/expense-sheet-drawer";
import { ExpensesOverview } from "@/components/dashboard/expenses/expenses-overview";
import { ExpensesTable } from "@/components/dashboard/expenses/expenses-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/server/better-auth/server";
import { api, HydrateClient } from "@/trpc/server";
import { IconPlus } from "@tabler/icons-react";

export default async function Page() {
  const session = await getSession();
  if (session) {
    void api.expense.overview.prefetch();
    void api.expense.list.prefetch({
      page: 1,
    });
  }

  return (
    <HydrateClient>
      <DashboardPage title="Expenses">
        <ExpensesOverview />
        <Card>
          <CardHeader>
            <CardTitle>Manage Expenses</CardTitle>
            <CardDescription>View and manage your expenses.</CardDescription>
            <CardAction>
              <ExpenseSheetDrawer>
                <Button>
                  <IconPlus />
                  Add Expense
                </Button>
              </ExpenseSheetDrawer>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ExpensesTable />
          </CardContent>
        </Card>
      </DashboardPage>
    </HydrateClient>
  );
}
