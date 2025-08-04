import { db } from "@/db";
import { z } from "zod";
import { and,count, eq, sql, getTableColumns, desc } from "drizzle-orm";
import { agents } from "@/db/schema";
import { createTRPCRouter , protectedProcedure} from "@/trpc/init";
import { agentsInsertSchema } from "../schemas";
import {DEFAULT_PAGE, MIN_PAGE_SIZE, MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE} from "@/constants";
// import {TRPCError} from "@trpc/server";
export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const [existingAgent] = await db
      .select({
        meetingCount: sql<number>`5`,
        ...getTableColumns(agents),
      })
      .from(agents)
      .where(eq(agents.id, input.id));
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
