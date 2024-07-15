import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getAccessToken: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const id = input.id;

      try {
        const account = await ctx.prisma.account.findFirst({
          where: {
            userId:id,
          },
        });

        if (!account) {
          return {
            code: 404,
            message: "User Not Found",
            data: null,
          };
        }

        return {
          code: 201,
          message: "Access_Token found",
          data: account.access_token,
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
