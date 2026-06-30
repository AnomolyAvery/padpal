"use client";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";
import { api } from "@/trpc/react";

export function ExpensesOverview() {
  const [overview] = api.expense.overview.useSuspenseQuery();
  return (
    <div className="grid gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Total Spent</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {formatCurrency(overview.sharedTotal + overview.personalTotal)}
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <div className="text-muted-foreground text-sm">
            {overview.expenseCount} personal & shared household expenses
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Average Expense</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {formatCurrency(overview.average)}
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <div className="text-muted-foreground text-sm">
            Average amount per expense
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Total Personal Expense</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {formatCurrency(overview.personalTotal)}
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <div className="text-muted-foreground text-sm">
            Highest single expense recorded
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Your Share of Expenses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {formatCurrency(overview.sharedTotal)}
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <div className="text-muted-foreground text-sm">
            {overview.sharedCount} shared expenses split between{" "}
            {overview.memberCount} members
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
