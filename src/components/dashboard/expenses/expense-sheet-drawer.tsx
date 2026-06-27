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
import { useMediaQuery } from "usehooks-ts";
import type { Expense } from "@/server/db/schema";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface ExpenseSheetProps {
  expense?: Expense;
  children: ReactNode;
}

export function ExpenseSheetDrawer({ expense, children }: ExpenseSheetProps) {
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
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

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{expense ? "Edit Expense" : "Add Expense"}</DrawerTitle>
          <DrawerDescription>
            {expense
              ? "Edit the expense details below"
              : "Create a new expense to add to your household budget"}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 sm:px-6">
          <ExpenseForm expense={expense} onSuccess={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
