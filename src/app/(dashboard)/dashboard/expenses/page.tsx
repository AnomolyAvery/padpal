import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ExpenseSheet } from "@/components/dashboard/expenses/expense-sheet";
import { ExpensesOverview } from "@/components/dashboard/expenses/expenses-overview";
import { ExpensesTable } from "@/components/dashboard/expenses/expenses-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";
import { getSession } from "@/server/better-auth/server";
import { api, HydrateClient } from "@/trpc/server";
import { IconPlus, IconTrendingUp } from "@tabler/icons-react";

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
              <ExpenseSheet>
                <Button>
                  <IconPlus />
                  Add Expense
                </Button>
              </ExpenseSheet>
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
