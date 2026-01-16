import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const monthValidator = v.union(
    v.literal(""),
    v.literal("Jan"),
    v.literal("Feb"),
    v.literal("Mar"),
    v.literal("Apr"),
    v.literal("May"),
    v.literal("Jun"),
    v.literal("Jul"),
    v.literal("Aug"),
    v.literal("Sep"),
    v.literal("Oct"),
    v.literal("Nov"),
    v.literal("Dec"),
  );

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("certificates").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("certificates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    ref_id: v.string(),
    name: v.string(),
    instructor: v.string(),
    platform: v.string(),
    course_link: v.string(),
    tech: v.array(v.string()),
    description: v.string(),
    certificate_link: v.string(),
    completed_month: monthValidator,
    completed_year: v.number(),
    tags: v.array(v.string()),
    current_course: v.boolean(),
    est_completion: v.number(),
    modules: v.any(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("certificates", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("certificates"),
    ref_id: v.string(),
    name: v.string(),
    instructor: v.string(),
    platform: v.string(),
    course_link: v.string(),
    tech: v.array(v.string()),
    description: v.string(),
    certificate_link: v.string(),
    completed_month: monthValidator,
    completed_year: v.number(),
    tags: v.array(v.string()),
    current_course: v.boolean(),
    est_completion: v.number(),
    modules: v.any(),
    image: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, {
      ...rest,
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("certificates") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
