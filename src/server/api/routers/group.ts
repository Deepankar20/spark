/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const groupRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        group_name: z.string(),
        description: z.string(),
        group_picture: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { group_name, description, group_picture } = input;
      let newGroup = {};
      try {
        if (ctx.session?.user.name) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
          newGroup = await ctx.prisma.group.create({
            data: {
              group_name,
              group_picture,
              description,
              createdBy: ctx.session?.user.name,
              members: {
                connect: { id: ctx.session?.user.id },
              },
            },
          });
        }

        if (!newGroup) {
          return {
            code: 502,
            message: "Database Error",
            data: null,
          };
        }

        return {
          code: 201,
          message: "Created Group Successfully",
          data: newGroup,
        };
      } catch (error) {
        return {
          code: 501,
          message: "Internal Server Error",
          data: null,
        };
      }
    }),

  addToGroup: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { groupId, userId } = input;

      try {

        const updatedGroup = await ctx.prisma.group.update({
          where: {
            id: groupId,
          },
          data: {
            members: {
              connect: { id: userId },
            },
          },
          include: {
            members: true,
          },
        });

        if (!updatedGroup) {
          return {
            code: 502,
            message: "Database Error",
            data: null,
          };
        }

        return {
          code: 201,
          message: "New Member Added To Group",
          data: updatedGroup,
        };
      } catch (error) {
        return {
          code: 501,
          message: "Internal Server Error",
          data: null,
        };
      }
    }),

  removeFromGroup: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { groupId, userId } = input;

      try {
        const updatedGroup = await ctx.prisma.group.update({
          where: {
            id: groupId,
          },
          data: {
            members: {
              disconnect: { id: userId },
            },
          },
          include: {
            members: true,
          },
        });

        if (!updatedGroup) {
          return {
            code: 502,
            message: "Database Error",
            data: null,
          };
        }

        return {
          code: 201,
          message: "New Member Added To Group",
          data: updatedGroup,
        };
      } catch (error) {
        return {
          code: 501,
          message: "Internal Server Error",
          data: null,
        };
      }
    }),

  getGroupByName: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { username } = input;

      try {
        const groups = await ctx.prisma.group.findMany({
          where: {
            createdBy: username,
          },
        });

        if (!groups) {
          return {
            code: 502,
            message: "Database Error",
            data: null,
          };
        }

        return {
          code: 201,
          message: "fetched all groups",
          data: groups,
        };
      } catch (error) {}
    }),

  getAllGroups: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;

      try {
        const user = await ctx.prisma.user.findUnique({
          where: {
            id: userId,
          },
          include: {
            Group: true,
          },
        });

        if (!user?.Group) {
          return {
            code: 404,
            message: "Groups not found",
            data: null,
          };
        }

        return {
          code: 201,
          message: "Groups fetched successfully",
          data: user.Group,
        };
      } catch (error) {
        return {
          code: 501,
          message: "Internal Server Error",
          data: null,
        };
      }
    }),

  getAllMembers: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { groupId } = input;

      try {
        const group = await ctx.prisma.group.findUnique({
          where: {
            id: groupId,
          },
          include: {
            members: true,
          },
        });
        if (!group?.members) {
          return {
            code: 404,
            message: "members not found",
            data: null,
          };
        }

        return {
          code: 201,
          message: "members fetched successfully",
          data: group.members,
        };
      } catch (error) {
        return {
          code: 501,
          message: "Internal Server Error",
          data: null,
        };
      }
    }),

  getGroupById: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { groupId } = input;

      try {
        const group = await ctx.prisma.group.findUnique({
          where: {
            id: groupId,
          },
        });

        if (!group) {
          return {
            code: 404,
            message: "Group Not Found",
            data: null,
          };
        }

        return {
          code: 201,
          message: "Group Fetched Successfully",
          data: group,
        };
      } catch (error) {
        console.log(error);

        return {
          code: 501,
          message: "Internal Server Error",
          data: null,
        };
      }
    }),

  getGroupStats: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { groupId } = input;
    }),
});
