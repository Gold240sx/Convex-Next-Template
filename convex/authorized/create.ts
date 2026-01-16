import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const checkAuth = async (ctx: any) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  return userId;
};

export const createPost = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const userId = await checkAuth(ctx);
    const identity = await ctx.auth.getUserIdentity();
    await ctx.db.insert("posts", {
      text: args.text,
      authorId: userId,
      authorEmail: identity?.email ?? "Unknown",
    });
  },
});

export const createTaskFromMessage = mutation({
  args: { 
    messageId: v.id("contactMessages"),
    title: v.string(),
    description: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    dueDate: v.optional(v.number()),
    reminder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await checkAuth(ctx);
    return await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      priority: args.priority,
      status: "todo",
      sourceType: "message",
      sourceId: args.messageId,
      authorId: userId,
      createdAt: Date.now(),
      dueDate: args.dueDate,
      reminder: args.reminder,
    });
  },
});

export const createCustomForm = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    slug: v.string(),
    fields: v.array(v.any()), // Use any to simplify for now, schema validation still happens
    isActive: v.boolean(),
    settings: v.optional(v.object({
      isConsecutive: v.optional(v.boolean()),
      completionEmail: v.optional(v.string()),
      chatbotAccess: v.optional(v.boolean())
    }))
  },
  handler: async (ctx, args) => {
    await checkAuth(ctx);
    const existing = await ctx.db
      .query("custom_forms")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
      
    if (existing) {
        throw new Error("Slug already exists");
    }

    await ctx.db.insert("custom_forms", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
