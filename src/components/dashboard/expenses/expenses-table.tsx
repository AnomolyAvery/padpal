"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { api } from "@/trpc/react";

export function ExpensesTable() {
  const { data: expenses, isLoading } = api.expense.list.useQuery({ page: 1 });

  // IMPORTANT: always return same shape during hydration
  const safeData = expenses ?? [];

  if (isLoading) {
    return (
      <div className="text-muted-foreground p-4 text-sm">
        Loading expenses...
      </div>
    );
  }

  return <DataTable columns={columns} data={safeData} />;
}
