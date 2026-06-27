import { createTRPCRouter, orgProtectedProcedure } from "../trpc";
import { expenses } from "@/server/db/schema";
import { and, desc, eq, or, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  createExpenseSchema,
  listExpensesSchema,
  updateExpenseSchema,
} from "@/validation/expenses";
import z from "zod";

export const expenseRouter = createTRPCRouter({
  overview: orgProtectedProcedure.query(async ({ ctx }) => {
    const [result] = await ctx.db
      .select({
        total: sql<number>`coalesce(sum(${expenses.amount}), 0)`,
        expenseCount: sql<number>`count(*)`,
        average: sql<number>`coalesce(avg(${expenses.amount}), 0)`,
        largest: sql<number>`coalesce(max(${expenses.amount}), 0)`,
        sharedCount: sql<number>`count(case when ${expenses.isShared} = true then 1 end)`,
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.orgId, ctx.session.activeOrganizationId),
          or(
            eq(expenses.userId, ctx.session.userId),
            eq(expenses.isShared, true),
          ),
        ),
      )
      .limit(1);

    if (!result) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No expenses found",
      });
    }

    return result;
  }),
  list: orgProtectedProcedure
    .input(listExpensesSchema)
    .query(async ({ ctx, input }) => {
      const limit = 20;
      const offset = (input.page - 1) * limit;

      const expenseList = await ctx.db
        .select()
        .from(expenses)
        .where(
          and(
            eq(expenses.orgId, ctx.session.activeOrganizationId),
            or(
              eq(expenses.userId, ctx.session.userId),
              eq(expenses.isShared, true),
            ),
          ),
        )
        .orderBy(desc(expenses.isShared), desc(expenses.amount))
        .limit(limit)
        .offset(offset);

      return expenseList;
    }),
  create: orgProtectedProcedure
    .input(createExpenseSchema)
    .mutation(async ({ input, ctx }) => {
      const [expense] = await ctx.db
        .insert(expenses)
        .values({
          name: input.name,
          amount: input.amount,
          isShared: input.isShared,
          category: input.category,
          userId: !input.isShared ? ctx.session.userId : undefined,
          orgId: ctx.session.activeOrganizationId,
        })
        .returning();

      return expense;
    }),
  update: orgProtectedProcedure
    .input(updateExpenseSchema)
    .mutation(async ({ ctx, input }) => {
      const [expense] = await ctx.db
        .update(expenses)
        .set({
          name: input.name,
          amount: input.amount,
          isShared: input.isShared,
          category: input.category,
          userId: !input.isShared ? ctx.session.userId : undefined,
        })
        .where(
          and(
            eq(expenses.id, input.id),
            eq(expenses.orgId, ctx.session.activeOrganizationId),
            or(
              eq(expenses.userId, ctx.session.userId),
              eq(expenses.isShared, true),
            ),
          ),
        )
        .returning();

      if (!expense) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return expense;
    }),
  delete: orgProtectedProcedure
    .input(
      z.object({
        id: z.string().cuid2(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(expenses)
        .where(
          and(
            eq(expenses.id, input.id),
            or(
              eq(expenses.userId, ctx.session.userId),
              eq(expenses.isShared, true),
            ),
          ),
        );
    }),
});
