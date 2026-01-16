import { v } from "convex/values";
import { query } from "../_generated/server";

export const getChatbotSettings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("chatbot_settings").first();
  },
});

export const getSiteContent = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("site_content")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
  },
});

export const getCustomFormBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("custom_forms")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getAllCustomForms = query({
  args: {},
  handler: async (ctx) => {
    // This is used by the chatbot to know which forms are available
    return await ctx.db.query("custom_forms").order("desc").collect();
  },
});
