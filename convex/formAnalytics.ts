import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Track a form analytics event
export const trackEvent = mutation({
  args: {
    formId: v.id("custom_forms"),
    eventType: v.union(v.literal("view"), v.literal("start"), v.literal("complete"), v.literal("bounce")),
    sessionId: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    referrer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("form_analytics", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get analytics for a specific form
export const getFormAnalytics = query({
  args: { formId: v.id("custom_forms") },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("form_analytics")
      .withIndex("by_form", (q) => q.eq("formId", args.formId))
      .collect();

    const views = events.filter(e => e.eventType === "view").length;
    const starts = events.filter(e => e.eventType === "start").length;
    const completions = events.filter(e => e.eventType === "complete").length;
    const bounces = events.filter(e => e.eventType === "bounce").length;

    // Calculate conversion rate
    const conversionRate = starts > 0 ? (completions / starts) * 100 : 0;
    const bounceRate = starts > 0 ? (bounces / starts) * 100 : 0;

    return {
      views,
      starts,
      completions,
      bounces,
      conversionRate: Math.round(conversionRate * 10) / 10,
      bounceRate: Math.round(bounceRate * 10) / 10,
    };
  },
});

// Get analytics over time (for charting)
export const getFormAnalyticsTimeSeries = query({
  args: { 
    formId: v.id("custom_forms"),
    days: v.optional(v.number()) // Default to 30 days
  },
  handler: async (ctx, args) => {
    const days = args.days || 30;
    const startDate = Date.now() - (days * 24 * 60 * 60 * 1000);

    const events = await ctx.db
      .query("form_analytics")
      .withIndex("by_form", (q) => q.eq("formId", args.formId))
      .filter((q) => q.gte(q.field("createdAt"), startDate))
      .collect();

    // Group by day
    const dailyData: Record<string, { views: number; starts: number; completions: number; bounces: number }> = {};

    events.forEach(event => {
      const date = new Date(event.createdAt).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { views: 0, starts: 0, completions: 0, bounces: 0 };
      }
      
      if (event.eventType === "view") dailyData[date].views++;
      if (event.eventType === "start") dailyData[date].starts++;
      if (event.eventType === "complete") dailyData[date].completions++;
      if (event.eventType === "bounce") dailyData[date].bounces++;
    });

    // Convert to array and sort by date
    return Object.entries(dailyData)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },
});

// Get all forms analytics summary
export const getAllFormsAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const forms = await ctx.db.query("custom_forms").collect();
    
    const analyticsPromises = forms.map(async (form) => {
      const events = await ctx.db
        .query("form_analytics")
        .withIndex("by_form", (q) => q.eq("formId", form._id))
        .collect();

      const views = events.filter(e => e.eventType === "view").length;
      const starts = events.filter(e => e.eventType === "start").length;
      const completions = events.filter(e => e.eventType === "complete").length;
      const bounces = events.filter(e => e.eventType === "bounce").length;

      return {
        formId: form._id,
        formName: form.name,
        views,
        starts,
        completions,
        bounces,
        conversionRate: starts > 0 ? Math.round((completions / starts) * 1000) / 10 : 0,
      };
    });

    return await Promise.all(analyticsPromises);
  },
});
