"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api, type RouterOutputs } from "@/trpc/react";
import {
  IconDotsVertical,
  IconPencil,
  IconToggleLeft,
  IconToggleRightFilled,
  IconTrash,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { ExpenseSheetDrawer } from "./expense-sheet-drawer";
import { formatCurrency } from "@/lib/currency";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { expenseCategoryMap } from "@/lib/expenses/category-map";

type Expense = RouterOutputs["expense"]["list"][number];

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const expense = row.original;
      const expenseInfo = expenseCategoryMap[expense.category];

      return (
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2">
              {expenseInfo && <expenseInfo.icon className="size-5" />}
              <span>{expenseInfo.name}</span>
            </div>
          </TooltipTrigger>
          {expenseInfo && (
            <TooltipContent>
              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  <expenseInfo.icon className="size-4" />
                  <p className="font-medium">{expenseInfo.name}</p>
                </div>

                <p className="text-muted-foreground max-w-60 text-xs">
                  {expenseInfo.description}
                </p>
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const expense = row.original;
      if (expense.shareAmount) {
        return `${formatCurrency(expense.amount)} (${formatCurrency(expense.shareAmount)})`;
      }

      return formatCurrency(row.original.amount);
    },
  },
  {
    accessorKey: "isShared",
    header: "Shared",
    cell: ({ row }) => <Checkbox disabled checked={row.original.isShared} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <ExpenseRowActions expense={row.original} />,
  },
];

function ExpenseRowActions({ expense }: { expense: Expense }) {
  const utils = api.useUtils();

  async function invalidateExpenseQueries() {
    await utils.expense.overview.invalidate();
    await utils.expense.list.invalidate();
  }

  const { mutate, isPending: isUpdating } = api.expense.update.useMutation({
    onSuccess: async (expense) => {
      if (!expense) return;

      toast.success("Updated expense successfully!", {
        description: `Your '${expense.name}' expense has been updated!`,
      });

      await invalidateExpenseQueries();
    },
    onError: (err) => {
      toast.error("Failed to update expense!", {
        description: err.message,
      });
    },
  });

  function onToggleShared() {
    const current = expense.isShared;

    mutate({
      id: expense.id,
      isShared: !current,
    });
  }

  const { mutate: deleteExpense, isPending: isDeleting } =
    api.expense.delete.useMutation({
      onSuccess: async () => {
        toast.success("Expense deleted successfully!", {
          description: `Your '${expense.name}' expense has been deleted.`,
        });
        await invalidateExpenseQueries();
      },
      onError: (err) => {
        toast.error("Failed to delete expense!", {
          description: err.message,
        });
      },
    });

  function onDelete() {
    const id = expense.id;

    deleteExpense({
      id,
    });
  }

  return (
    <div className="flex w-full justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <ExpenseSheetDrawer expense={expense}>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <IconPencil />
              Edit
            </DropdownMenuItem>
          </ExpenseSheetDrawer>

          <DropdownMenuItem onClick={onToggleShared} disabled={isUpdating}>
            {expense.isShared ? <IconToggleRightFilled /> : <IconToggleLeft />}
            Switch to {expense.isShared ? "Personal" : "Shared"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={isDeleting}
            onClick={onDelete}
          >
            <IconTrash />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
