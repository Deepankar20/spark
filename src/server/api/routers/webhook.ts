import { date, z } from "zod";

import { format, startOfDay, subMonths, eachDayOfInterval } from "date-fns";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const webhookRouter = createTRPCRouter({
  push: publicProcedure
    .input(
      z.object({
        repo: z.string(),
        date: z.date(),
        message: z.string(),
        sha: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        console.log('HI from WEBHOOK');
        
        console.log(input);
        

        
      } catch (error) {

      }
    }),
});
