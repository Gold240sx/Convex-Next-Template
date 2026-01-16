import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tech_icon_variant").collect();
  },
});

export const getById = query({
  args: { id: v.id("tech_icon_variant") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tech_icon_variant", {
      name: args.name,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("tech_icon_variant"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { name: args.name });
  },
});

export const remove = mutation({
  args: {
    id: v.id("tech_icon_variant"),
    handleIcons: v.union(v.literal("delete"), v.literal("reassign")),
    newVariantId: v.optional(v.id("tech_icon_variant")),
  },
  handler: async (ctx, args) => {
    const icons = await ctx.db
      .query("techIcons")
      .withIndex("by_variant_id", (q) => q.eq("variant_id", args.id))
      .collect();

    if (args.handleIcons === "delete") {
      for (const icon of icons) {
        const techId = icon.tech_id;
        // Delete the triplet
        await ctx.db.delete(icon._id);
        
        const details = await ctx.db
          .query("techDetails")
          .withIndex("by_tech_id", (q) => q.eq("tech_id", techId))
          .unique();
        if (details) await ctx.db.delete(details._id);

        await ctx.db.delete(techId);
      }
    } else if (args.handleIcons === "reassign" && args.newVariantId) {
      for (const icon of icons) {
        await ctx.db.patch(icon._id, { variant_id: args.newVariantId });
      }
    }

    await ctx.db.delete(args.id);
  },
});
