import { createTRPCRouter } from "./create-context";
import { plantRouter } from "./routes/plant";

export const appRouter = createTRPCRouter({
  plant: plantRouter,
});

export type AppRouter = typeof appRouter;
