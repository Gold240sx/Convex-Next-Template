import { v } from "convex/values";
import { action } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const checkAuth = async (ctx: any) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  return userId;
};

export const checkEnvVar = action({
  args: { envVarName: v.string() },
  handler: async (ctx, args) => {
    await checkAuth(ctx);
    return process.env[args.envVarName] !== undefined;
  },
});
