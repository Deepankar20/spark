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
    .input(z.object({ number: z.number(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { number, userId } = input;
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
              gte: startDate.toISOString(), // Convert start date to ISO string
              lte: today.toISOString(),
            },
            userId,
          },
          orderBy: {
            date: "asc",
          },
        });

        interface CommitCounts {
          [key: string]: number;
        }
        const commitCounts = commitsPerDay.reduce(
          (acc: CommitCounts, { _count, date }) => {
            const dateKey = new Date(date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            });
            if (!acc[dateKey]) {
              acc[dateKey] = 0;
            }
            acc[dateKey] += _count.id;
            return acc;
          },
          {}
        );

        const commitArray = Object.entries(commitCounts).map(
          ([date, commitCount]) => ({ date, commitCount })
        );

        // Create a map of dates with commit counts
        const commitCountMap = new Map<string, number>();
        commitsPerDay.forEach((group) => {
          commitCountMap.set(
            format(startOfDay(new Date(group.date)), "yyyy-MM-dd"),
            group._count.id
          );
        });

        // Generate the full range of dates

        // Create the formatted results with zeros for missing dates

        return {
          code: 201,
          message: "Success",
          data: commitArray,
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

  compareCommits: publicProcedure
    .input(
      z.object({ number: z.number(), user1Id: z.string(), user2Id: z.string() })
    )
    .mutation(async ({ input, ctx }) => {
      const { number, user1Id, user2Id } = input;
      const startDate = subMonths(new Date(), number);
      const today = new Date();

      async function getCommitsPerDay(userId: string) {
        const commitsPerDay = await ctx.prisma.commit.groupBy({
          by: ["date"],
          _count: {
            id: true,
          },
          where: {
            date: {
              gte: startDate.toISOString(), // Convert start date to ISO string
              lte: today.toISOString(),
            },
            userId,
          },
          orderBy: {
            date: "asc",
          },
        });

        interface CommitCounts {
          [key: string]: number;
        }
        const commitCounts = commitsPerDay.reduce(
          (acc: CommitCounts, { _count, date }) => {
            const dateKey = new Date(date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            });
            if (!acc[dateKey]) {
              acc[dateKey] = 0;
            }
            acc[dateKey] += _count.id;
            return acc;
          },
          {}
        );

        const commitArray = Object.entries(commitCounts).map(
          ([date, commitCount]) => ({ date, commitCount })
        );

        // Create a map of dates with commit counts
        const commitCountMap = new Map<string, number>();
        commitsPerDay.forEach((group) => {
          commitCountMap.set(
            format(startOfDay(new Date(group.date)), "yyyy-MM-dd"),
            group._count.id
          );
        });

        return commitArray;
      }

      try {
        const user1Data = await getCommitsPerDay(user1Id);
        const user2Data = await getCommitsPerDay(user2Id);

        const allDates = Array.from(
          new Set([
            ...user1Data.map((entry) => entry.date),
            ...user2Data.map((entry) => entry.date),
          ])
        );

        const fillUserData = (userData: any[], allDates: any[]) => {
          return allDates.map((date: any) => {
            // Ensure the date comparison is done correctly (e.g., same format)
            const dataForDate = userData.find(
              (entry: { date: any }) => entry.date === date
            );

            // If dataForDate is found, use its commits; otherwise, use 0.
            return { date, commits: dataForDate ? dataForDate.commitCount : 0 };
          });
        };

        const filledUser1Data = fillUserData(user1Data, allDates);

        const filledUser2Data = fillUserData(user2Data, allDates);

        const mergedData = filledUser1Data.map(
          (entry: { date: string; commits: number }, index: number) => ({
            date: entry.date,
            user1Commits: entry.commits,
            user2Commits: filledUser2Data[index]?.commits || 0,
          })
        );

        return {
          code: 201,
          message: "successfully compared",
          data: mergedData,
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
