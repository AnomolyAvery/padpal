import z from "zod";

export const createExpenseSchema = z.object({
  name: z.string().min(3),
  amount: z.number().min(0.01),
  isShared: z.boolean(),
  category: z.enum([
    "housing",
    "utilities",
    "groceries",
    "dining",
    "transportation",
    "vehicle",
    "insurance",
    "debt",
    "subscriptions",
    "shopping",
    "healthcare",
    "entertainment",
    "other",
  ]),
});

export const updateExpenseSchema = createExpenseSchema.partial().extend({
  id: z.string().cuid2(),
});

export const listExpensesSchema = z.object({
  page: z.number().optional().default(1),
});
