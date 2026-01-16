import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or update SEO metadata for a page
export const upsertSeoMetadata = mutation({
  args: {
    pagePath: v.string(),
    pageTitle: v.string(),
    metaDescription: v.string(),
    keywords: v.optional(v.array(v.string())),
    ogTitle: v.optional(v.string()),
    ogDescription: v.optional(v.string()),
    ogImage: v.optional(v.string()),
    ogImageAlt: v.optional(v.string()),
    twitterCard: v.optional(v.union(
      v.literal("summary"),
      v.literal("summary_large_image"),
      v.literal("app"),
      v.literal("player")
    )),
    twitterTitle: v.optional(v.string()),
    twitterDescription: v.optional(v.string()),
    twitterImage: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    robots: v.optional(v.string()),
    isActive: v.boolean(),
    priority: v.optional(v.number()),
    changeFrequency: v.optional(v.union(
      v.literal("always"),
      v.literal("hourly"),
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("monthly"),
      v.literal("yearly"),
      v.literal("never")
    )),
  },
  handler: async (ctx, args) => {
    // Check if SEO metadata already exists for this path
    const existing = await ctx.db
      .query("seo_metadata")
      .withIndex("by_path", (q) => q.eq("pagePath", args.pagePath))
      .first();

    if (existing) {
      // Update existing
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      // Create new
      const id = await ctx.db.insert("seo_metadata", {
        ...args,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return id;
    }
  },
});

// Get SEO metadata for a specific page path
export const getSeoByPath = query({
  args: { pagePath: v.string() },
  handler: async (ctx, args) => {
    const seo = await ctx.db
      .query("seo_metadata")
      .withIndex("by_path", (q) => q.eq("pagePath", args.pagePath))
      .first();
    
    return seo;
  },
});

// Get all SEO metadata entries
export const listAllSeo = query({
  args: {},
  handler: async (ctx) => {
    const seoEntries = await ctx.db
      .query("seo_metadata")
      .order("desc")
      .collect();
    
    return seoEntries;
  },
});

// Get active SEO metadata entries (for sitemap generation)
export const getActiveSeo = query({
  args: {},
  handler: async (ctx) => {
    const activeSeo = await ctx.db
      .query("seo_metadata")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
    
    return activeSeo;
  },
});

// Delete SEO metadata
export const deleteSeo = mutation({
  args: { id: v.id("seo_metadata") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Toggle SEO active status
export const toggleSeoActive = mutation({
  args: { 
    id: v.id("seo_metadata"),
    isActive: v.boolean()
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isActive: args.isActive,
      updatedAt: Date.now(),
    });
  },
});
