import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { topicRouter } from "./routers/topic";
import { noteRouter } from "./routers/note";
import { userRouter } from "./routers/user";
import { groupRouter } from "./routers/group";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  topic: topicRouter,
  note: noteRouter,
  user:userRouter,
  group:groupRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
