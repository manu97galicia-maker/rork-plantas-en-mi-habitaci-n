import { initTRPC, TRPCError } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import superjson from "superjson";

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

export const createContext = async (opts: FetchCreateContextFnOptions) => {
  const deviceId = opts.req.headers.get("x-device-id") || "anonymous";
  
  return {
    req: opts.req,
    deviceId,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const rateLimitMiddleware = t.middleware(async ({ ctx, next }) => {
  const now = Date.now();
  const key = ctx.deviceId;
  
  let rateLimit = rateLimitStore.get(key);
  
  if (!rateLimit || now > rateLimit.resetTime) {
    rateLimit = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
    rateLimitStore.set(key, rateLimit);
  }
  
  rateLimit.count++;
  
  if (rateLimit.count > MAX_REQUESTS_PER_WINDOW) {
    console.log(`[RateLimit] Device ${key} exceeded limit: ${rateLimit.count}/${MAX_REQUESTS_PER_WINDOW}`);
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Rate limit exceeded. Please try again later.",
    });
  }
  
  console.log(`[RateLimit] Device ${key}: ${rateLimit.count}/${MAX_REQUESTS_PER_WINDOW}`);
  
  return next({ ctx });
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const rateLimitedProcedure = t.procedure.use(rateLimitMiddleware);
