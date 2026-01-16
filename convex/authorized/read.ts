import { v } from "convex/values";
import { query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const checkAuth = async (ctx: any) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  return userId;
};

export const getUsersPosts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await checkAuth(ctx);
    return await ctx.db
      .query("posts")
      .withIndex("by_authorId", (q) => q.eq("authorId", userId))
      .collect();
  },
});

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    return await ctx.db.get(userId);
  },
});

export const getAllContactMessages = query({
  args: {},
  handler: async (ctx) => {
    await checkAuth(ctx);
    return await ctx.db
      .query("contactMessages")
      .filter((q) => 
        q.or(
          q.eq(q.field("archivedAt"), undefined),
          q.eq(q.field("archivedAt"), null)
        )
      )
      .order("desc")
      .collect();
  },
});

export const getArchivedContactMessages = query({
  args: {},
  handler: async (ctx) => {
    await checkAuth(ctx);
    return await ctx.db
      .query("contactMessages")
      .filter((q) => 
        q.and(
          q.neq(q.field("archivedAt"), undefined),
          q.neq(q.field("archivedAt"), null)
        )
      )
      .order("desc")
      .collect();
  },
});

export const getUnreadMessageCount = query({
  args: {},
  handler: async (ctx) => {
    await checkAuth(ctx);
    const unread = await ctx.db
      .query("contactMessages")
      .filter((q) => 
        q.and(
            q.or(
                q.eq(q.field("archivedAt"), undefined),
                q.eq(q.field("archivedAt"), null)
            ),
            q.or(
                q.eq(q.field("readAt"), undefined),
                q.eq(q.field("readAt"), null)
            )
        )
      )
      .collect();
    return unread.length;
  },
});

export const getContactMessageById = query({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    await checkAuth(ctx);
    return await ctx.db.get(args.id);
  },
});

export const getTasks = query({
  args: {},
  handler: async (ctx) => {
    await checkAuth(ctx);
    return await ctx.db
      .query("tasks")
      .filter((q) => 
        q.or(
          q.eq(q.field("archivedAt"), undefined),
          q.eq(q.field("archivedAt"), null)
        )
      )
      .order("desc")
      .collect();
  },
});

export const getArchivedTasks = query({
  args: {},
  handler: async (ctx) => {
    await checkAuth(ctx);
    return await ctx.db
      .query("tasks")
      .filter((q) => 
        q.and(
          q.neq(q.field("archivedAt"), undefined),
          q.neq(q.field("archivedAt"), null)
        )
      )
      .order("desc")
      .collect();
  },
});

export const getCustomFormById = query({
  args: { id: v.id("custom_forms") },
  handler: async (ctx, args) => {
    await checkAuth(ctx);
    return await ctx.db.get(args.id);
  },
});
