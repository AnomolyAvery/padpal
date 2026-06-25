import z from "zod";
import { createTRPCRouter, orgProtectedProcedure } from "../trpc";
import { expenses } from "@/server/db/schema";
import { and, eq, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const expenseRouter = createTRPCRouter({
  list: orgProtectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
      }),
    )
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
        .limit(limit)
        .offset(offset);

      return expenseList;
    }),
  create: orgProtectedProcedure
    .input(
      z.object({
        name: z.string(),
        amount: z.number(),
        isShared: z.boolean().default(false),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const [expense] = await ctx.db
        .insert(expenses)
        .values({
          name: input.name,
          amount: input.amount,
          isShared: input.isShared,
          userId: !input.isShared ? ctx.session.userId : undefined,
          orgId: ctx.session.activeOrganizationId,
        })
        .returning();

      return expense;
    }),
  update: orgProtectedProcedure
    .input(
      z.object({
        id: z.string().cuid2(),
        name: z.string().optional(),
        amount: z.number().optional(),
        isShared: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [expense] = await ctx.db
        .update(expenses)
        .set({
          name: input.name,
          amount: input.amount,
          isShared: input.isShared,
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
});
