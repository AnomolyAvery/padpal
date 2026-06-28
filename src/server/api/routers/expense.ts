import { createTRPCRouter, orgProtectedProcedure } from "../trpc";
import { expenses, member } from "@/server/db/schema";
import { and, count, desc, eq, getTableColumns, or, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  createExpenseSchema,
  listExpensesSchema,
  updateExpenseSchema,
} from "@/validation/expenses";
import z from "zod";

export const expenseRouter = createTRPCRouter({
  overview: orgProtectedProcedure.query(async ({ ctx }) => {
    const { session } = ctx;

    const memberCountSubQuery = ctx.db
      .select({
        count: count(),
      })
      .from(member)
      .where(eq(member.organizationId, session.activeOrganizationId))
      .limit(1);

    const [result] = await ctx.db
      .select({
        total: sql<number>`coalesce(sum(${expenses.amount}), 0)`,
        expenseCount: sql<number>`count(*)`,
        average: sql<number>`coalesce(avg(${expenses.amount}), 0)`,
        largest: sql<number>`coalesce(max(${expenses.amount}), 0)`,
        sharedCount: sql<number>`count(case when ${expenses.isShared} = true then 1 end)`,
        sharedTotal: sql<number>`coalesce(sum(case when ${expenses.isShared} = true then ${expenses.amount} end) / (${memberCountSubQuery}), 0)`,
        memberCount: sql<number>`(${memberCountSubQuery})`,
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.orgId, session.activeOrganizationId),
          or(eq(expenses.userId, session.userId), eq(expenses.isShared, true)),
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

      const { session } = ctx;

      const memberCountSubQuery = ctx.db
        .select({ count: count() })
        .from(member)
        .where(eq(member.organizationId, session.activeOrganizationId))
        .limit(1);

      const expenseList = await ctx.db
        .select({
          ...getTableColumns(expenses),
          memberCount: sql<number>`(${memberCountSubQuery})`,
        })
        .from(expenses)
        .where(
          and(
            eq(expenses.orgId, session.activeOrganizationId),
            or(
              eq(expenses.userId, session.userId),
              eq(expenses.isShared, true),
            ),
          ),
        )
        .orderBy(desc(expenses.isShared), desc(expenses.amount))
        .limit(limit)
        .offset(offset);

      return expenseList.map((e) => ({
        ...e,
        shareAmount:
          e.isShared && e.memberCount > 1
            ? e.amount / e.memberCount
            : undefined,
      }));
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
