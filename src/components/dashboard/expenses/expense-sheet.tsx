"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ExpenseForm } from "./expense-form";
import { useState, type ReactNode } from "react";
import type { Expense } from "@/server/db/schema";

interface ExpenseSheetProps {
  expense?: Expense;
  children: ReactNode;
}

export function ExpenseSheet({ expense, children }: ExpenseSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{expense ? "Edit Expense" : "Add Expense"}</SheetTitle>
          <SheetDescription>
            {expense
              ? "Edit the expense details below"
              : "Create a new expense to add to your household budget"}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 sm:px-6">
          <ExpenseForm expense={expense} onSuccess={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
