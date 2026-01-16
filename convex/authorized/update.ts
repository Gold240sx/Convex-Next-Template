import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const checkAuth = async (ctx: any) => {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  return userId;
};

export const markContactMessageAsRead = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    await checkAuth(ctx);
    await ctx.db.patch(args.id, {
      readAt: Date.now(),
    });
  },
});

export const markContactMessageAsUnread = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    await checkAuth(ctx);
    await ctx.db.patch(args.id, {
      readAt: null,
      archivedAt: null,
    });
  },
});

export const archiveContactMessage = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    await checkAuth(ctx);
    await ctx.db.patch(args.id, { archivedAt: Date.now() });
  },
});

export const unarchiveContactMessage = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    await checkAuth(ctx);
    await ctx.db.patch(args.id, { archivedAt: null });
  },
});

export const updateTaskStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(v.literal("todo"), v.literal("in_progress"), v.literal("done"))
  },
  handler: async (ctx, args) => {
    await checkAuth(ctx);
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const archiveTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await checkAuth(ctx);
    await ctx.db.patch(args.id, { archivedAt: Date.now() });
  },
});

export const unarchiveTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await checkAuth(ctx);
    await ctx.db.patch(args.id, { archivedAt: null });
  },
});

export const updateTask = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.optional(v.number()),
    reminder: v.optional(v.number()),
    status: v.optional(v.union(v.literal("todo"), v.literal("in_progress"), v.literal("done")))
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await checkAuth(ctx);
    await ctx.db.patch(id, updates);
  },
});

export const updateChatbotSettings = mutation({
  args: {
    systemPrompt: v.string(),
    knowledgeBase: v.string(),
    model: v.string(),
    temperature: v.number(),
  },
  handler: async (ctx, args) => {
    await checkAuth(ctx);
    const existing = await ctx.db.query("chatbot_settings").first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        lastUpdated: Date.now(),
      });
    } else {
      await ctx.db.insert("chatbot_settings", {
        ...args,
        lastUpdated: Date.now(),
      });
    }
  },
});

export const updateSiteContent = mutation({
  args: { key: v.string(), content: v.string() },
  handler: async (ctx, args) => {
    await checkAuth(ctx);
    const existing = await ctx.db
      .query("site_content")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    
    if (existing) {
      await ctx.db.patch(existing._id, {
        content: args.content,
        lastUpdated: Date.now(),
      });
    } else {
      await ctx.db.insert("site_content", {
        key: args.key,
        content: args.content,
        lastUpdated: Date.now(),
      });
    }
  },
});

export const updateCustomForm = mutation({
  args: {
    id: v.id("custom_forms"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    slug: v.optional(v.string()),
    fields: v.optional(v.array(v.any())),
    isActive: v.optional(v.boolean()),
    settings: v.optional(v.object({
      isConsecutive: v.optional(v.boolean()),
      completionEmail: v.optional(v.string()),
      chatbotAccess: v.optional(v.boolean())
    }))
  },
  handler: async (ctx, args) => {
    await checkAuth(ctx);
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});
