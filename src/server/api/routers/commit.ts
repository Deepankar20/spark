/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { date, z } from "zod";

import { format, startOfDay, subMonths, eachDayOfInterval } from "date-fns";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const commitRouter = createTRPCRouter({
  getCommitsByRepo: publicProcedure
    .input(z.object({ repo: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { repo } = input;

      try {
        const commits = await ctx.prisma.commit.findMany({
          where: {
            repository: repo,
          },
        });

        if (!commits) {
          return {
            code: 404,
            message: "Commits Not Found",
            data: null,
          };
        }

        return {
          code: 201,
          message: "Fetched commits of repo",
          data: commits,
        };
      } catch (error) {
        return {
          code: 501,
          message: "Internal Server Error",
          data: null,
        };
      }
    }),

  getRecentCommits: publicProcedure
    .input(z.object({ number: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { number } = input;

      try {
        const commits = await ctx.prisma.commit.findMany({
          where: {
            userId: ctx.session?.user.id,
          },

          orderBy: {
            date: "desc",
          },
          take: number,
        });

        if (!commits) {
          return {
            code: 404,
            message: "Commits Not Found",
            data: null,
          };
        }

        return {
          code: 201,
          message: "Fetched recent commits of a user",
          data: commits,
        };
      } catch (error) {
        return {
          code: 501,
          message: "Internal Server Error",
          data: null,
        };
      }
    }),

  getCommitsPerDay: publicProcedure
    .input(z.object({ number: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { number } = input;
      const startDate = subMonths(new Date(), number);
      const today = new Date();

      try {
        const commitsPerDay = await ctx.prisma.commit.groupBy({
          by: ["date"],
          _count: {
            id: true,
          },
          where: {
            date: {
              gte: startDate,
            },
            userId: ctx.session?.user.id,
          },
          orderBy: {
            date: "asc",
          },
        });
        // Create a map of dates with commit counts
        const commitCountMap = new Map<string, number>();
        commitsPerDay.forEach((group) => {
          commitCountMap.set(
            format(startOfDay(new Date(group.date)), "yyyy-MM-dd"),
            group._count.id
          );
        });

        // Generate the full range of dates
        const allDates = eachDayOfInterval({
          start: startDate,
          end: today,
        });

        // Create the formatted results with zeros for missing dates
        const formattedResults = allDates.map((date) => {
          const formattedDate = format(startOfDay(date), "yyyy-MM-dd");
          return {
            date: format(date, "d MMM"),
            commitCount: commitCountMap.get(formattedDate) || 0,
          };
        });
        

        return {
          code: 201,
          message: "Success",
          data: formattedResults,
        };
      } catch (error) {
        console.error("Error fetching commits:", error);
        return {
          code: 501,
          message: "Internal server error",
          data: null,
        };
      }
    }),
});
