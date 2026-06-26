"use client";

import { FieldGroup } from "@/components/ui/field";
import { formatCurrency } from "@/lib/currency";
import { expenseCategoryMap } from "@/lib/expenses/category-map";
import { useAppForm } from "@/lib/forms";
import type { Expense } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { createExpenseSchema } from "@/validation/expenses";
import { toast } from "sonner";

interface ExpenseFormProps {
  expense?: Expense;
  onSuccess: () => void;
}

export function ExpenseForm({ expense, onSuccess }: ExpenseFormProps) {
  const utils = api.useUtils();

  async function invalidateExpenseQueries() {
    await utils.expense.overview.invalidate();
    await utils.expense.list.invalidate();
  }

  const { mutateAsync: create } = api.expense.create.useMutation({
    onSuccess: async (expense) => {
      if (!expense) {
        return;
      }

      toast.success("Expense successfully added!", {
        description: `Your expense of ${formatCurrency(expense.amount)} for ${expense.name} has been added.`,
      });
      await invalidateExpenseQueries();
      onSuccess();
    },
    onError: (err) => {
      toast.error("Failed to create expense", {
        description: err.message,
      });
    },
  });

  const { mutateAsync: update } = api.expense.update.useMutation({
    onSuccess: async (expense) => {
      if (!expense) {
        return;
      }

      toast.success("Updated expense successfully!", {
        description: `Your expense of ${formatCurrency(expense.amount)} for ${expense.name} has been updated.`,
      });
      await invalidateExpenseQueries();
      onSuccess();
    },
    onError: (err) => {
      toast.error("Failed to update expense!", {
        description: err.message,
      });
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: expense?.name ?? "",
      amount: expense ? expense.amount / 100 : 0,
      isShared: expense?.isShared ?? false,
      category: expense?.category ?? "",
    },
    validators: {
      onSubmit: createExpenseSchema,
    },
    onSubmit: async ({ value }) => {
      if (!expense) {
        await create({
          name: value.name,
          amount: value.amount * 100,
          isShared: value.isShared,
          category: value.category as Expense["category"],
        });
        return;
      }

      await update({
        id: expense.id,
        name: value.name,
        amount: value.amount * 100,
        isShared: value.isShared,
        category: value.category as Expense["category"],
      });
    },
  });

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();

        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="name">
          {(field) => (
            <field.TextField label="Name" placeholder="Car Payment" />
          )}
        </form.AppField>
        <form.AppField name="category">
          {(field) => (
            <field.SelectField
              label="Category"
              placeholder="Select a category"
              options={Object.entries(expenseCategoryMap).map(
                ([category, { name, icon }]) => ({
                  label: name,
                  value: category,
                  icon: icon,
                }),
              )}
            />
          )}
        </form.AppField>
        <form.AppField name="amount">
          {(field) => (
            <field.TextField
              label="Amount"
              placeholder="420.00"
              type="number"
              asNumber
            />
          )}
        </form.AppField>
        <form.AppField name="isShared">
          {(field) => <field.CheckboxField label="Is Shared Expense?" />}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton
            label={expense ? "Update Expense" : "Create Expense"}
          />
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}
