import { db } from "@/db";
import { z } from "zod";
import { and, count, eq, getTableColumns, desc, ilike } from "drizzle-orm";
import {  meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { DEFAULT_PAGE, MIN_PAGE_SIZE, MAX_PAGE_SIZE, DEFAULT_PAGE_SIZE } from "@/constants";
import { TRPCError } from "@trpc/server";

export const meetingsRouter = createTRPCRouter({
  

  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const [existingMeeting] = await db
      .select({
        
        ...getTableColumns(meetings),
      })
      .from(meetings)
      .where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)));

    if (!existingMeeting) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" });
    }
    return existingMeeting;
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

      const whereConditionsArr = [eq(meetings.userId, ctx.auth.user.id)];
      if (search) {
        whereConditionsArr.push(ilike(meetings.name, `%${search}%`));
      }
      const whereConditions =
        whereConditionsArr.length > 1
          ? and(...whereConditionsArr)
          : whereConditionsArr[0];

      const data = await db
        .select({
         
          ...getTableColumns(meetings),
        })
        .from(meetings)
        .where(whereConditions)
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const totalResult = await db
        .select({ count: count() })
        .from(meetings)
        .where(whereConditions);

      const total = totalResult[0]?.count ?? 0;
      const totalPages = Math.ceil(total / pageSize);

      return {
        items: data,
        total,
        totalPages,
      };
    }),

 
  
});
