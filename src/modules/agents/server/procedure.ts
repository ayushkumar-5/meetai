import { db } from "@/db";
import { z } from "zod";
import { and, count, eq, sql, getTableColumns, desc } from "drizzle-orm";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema, agentsUpdateSchema } from "../schemas";
import { DEFAULT_PAGE, MIN_PAGE_SIZE, MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE } from "@/constants";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
  update: protectedProcedure
    .input(agentsUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const [updatedAgent] = await db
        .update(agents)
        .set(input)
        .where(
          and(
            eq(agents.id, input.id),
            eq(agents.userId, ctx.auth.user.id)
          )
        )
        .returning();
      if (!updatedAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }
      return updatedAgent;
    }),

    

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [removedAgent] = await db
        .delete(agents)
        .where(
          and(
            eq(agents.id, input.id),
            eq(agents.userId, ctx.auth.user.id),
          )
        )
        .returning();
      if (!removedAgent) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }
      return removedAgent;
    }),

  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const [existingAgent] = await db
      .select({
        meetingCount: sql<number>`5`,
        ...getTableColumns(agents),
      })
      .from(agents)
      .where(and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id)));

    if (!existingAgent) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
    }
    return existingAgent;
  }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE, search } = input || {};

      const whereConditions = and(
        eq(agents.userId, ctx.auth.user.id),
        search ? sql`${agents.name} ILIKE ${`%${search}%`}` : undefined
      );

      const data = await db
        .select({
          meetingCount: sql<number>`5`,
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(whereConditions)
        .orderBy(desc(agents.createdAt), desc(agents.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const totalResult = await db
        .select({ count: count() })
        .from(agents)
        .where(whereConditions);

      const total = totalResult[0]?.count ?? 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items: data,
        total,
        totalPages,
      };
    }),

  create: protectedProcedure.input(agentsInsertSchema).mutation(async ({ input, ctx }) => {
    const [createdAgent] = await db
      .insert(agents)
      .values({
        ...input,
        userId: ctx.auth.user.id,
      })
      .returning();
    return createdAgent;
  }),
});
