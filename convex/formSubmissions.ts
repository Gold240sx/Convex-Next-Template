import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a form submission
export const create = mutation({
  args: {
    formId: v.id("custom_forms"),
    formName: v.string(),
    submitterEmail: v.optional(v.string()),
    submitterName: v.optional(v.string()),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    const submissionId = await ctx.db.insert("form_submissions", {
      ...args,
      isRead: false,
      createdAt: Date.now(),
    });
    return submissionId;
  },
});

// Get all form submissions
export const list = query({
  args: {},
  handler: async (ctx) => {
    const submissions = await ctx.db
      .query("form_submissions")
      .order("desc")
      .collect();
    return submissions;
  },
});

// Get unread form submissions count
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const unread = await ctx.db
      .query("form_submissions")
      .withIndex("by_read", (q) => q.eq("isRead", false))
      .collect();
    return unread.length;
  },
});

// Get submissions for a specific form
export const getByForm = query({
  args: { formId: v.id("custom_forms") },
  handler: async (ctx, args) => {
    const submissions = await ctx.db
      .query("form_submissions")
      .withIndex("by_form", (q) => q.eq("formId", args.formId))
      .order("desc")
      .collect();
    return submissions;
  },
});

// Mark submission as read
export const markAsRead = mutation({
  args: { id: v.id("form_submissions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isRead: true });
  },
});

// Mark submission as unread
export const markAsUnread = mutation({
  args: { id: v.id("form_submissions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isRead: false });
  },
});

// Delete a submission
export const remove = mutation({
  args: { id: v.id("form_submissions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
