import { date, z } from "zod";

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

});
