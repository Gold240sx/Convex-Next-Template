import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const checkAuth = async (ctx: any) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  return userId;
};

export const deleteCustomForm = mutation({
  args: { id: v.id("custom_forms") },
  handler: async (ctx, args) => {
    await checkAuth(ctx);
    await ctx.db.delete(args.id);
  },
});
