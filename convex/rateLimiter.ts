import { RateLimiter, SECOND } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  chat: { kind: "fixed window", rate: 4, period: 30 * SECOND },
  tokenUsage: { kind: "token bucket", period: 60 * SECOND, rate: 5000, capacity: 10000 },
  globalTokenUsage: { kind: "token bucket", period: 60 * SECOND, rate: 50000 },
});

export const { getRateLimit, getServerTime } = rateLimiter.hookAPI("chat", {
  key: async (ctx) => (await getAuthUserId(ctx)) ?? "anonymous",
});
