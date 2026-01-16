import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

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
  
const ratingValidator = v.union(
    v.literal(""),
    v.literal("1"),
    v.literal("2"),
    v.literal("3"),
    v.literal("4"),
    v.literal("5"),
);

const categoryValidator = v.union(
    v.literal("UI Lib"),
    v.literal("AI"),
    v.literal("Database"),
    v.literal("API's"),
    v.literal("iOS/mobile dev"),
    v.literal("Backend"),
    v.literal("Framework"),
    v.literal("Library"),
    v.literal("Version Control"),
    v.literal("Authentication"),
    v.literal("Web"),
    v.literal("Backend Tooling"),
    v.literal("Css Framework"),
    v.literal("Email"),
    v.literal("ORM/RDBMS"),
    v.literal("Low-Code / No Code / VibeCode"),
    v.literal("Design"),
    v.literal("Animation"),
    v.literal("Language"),
    v.literal("CMS"),
    v.literal("Testing")
);

export const list = query({
  args: {},
  handler: async (ctx) => {
    const techs = await ctx.db.query("tech").collect();
    const results = await Promise.all(
      techs.map(async (t) => {
        const allIcons = await ctx.db
          .query("techIcons")
          .withIndex("by_tech_id", (q) => q.eq("tech_id", t._id))
          .collect();
        const icon = allIcons[0]; // Keep for backward compatibility
        const details = await ctx.db
          .query("techDetails")
          .withIndex("by_tech_id", (q) => q.eq("tech_id", t._id))
          .first();
        return {
          ...t,
          icon,
          allIcons,
          details,
        };
      })
    );
    return results;
  },
});

export const getById = query({
  args: { id: v.id("tech") },
  handler: async (ctx, args) => {
    const tech = await ctx.db.get(args.id);
    if (!tech) return null;
    const icon = await ctx.db
      .query("techIcons")
      .withIndex("by_tech_id", (q) => q.eq("tech_id", tech._id))
      .first();
    const details = await ctx.db
      .query("techDetails")
      .withIndex("by_tech_id", (q) => q.eq("tech_id", tech._id))
      .first();
    return {
      ...tech,
      icon,
      details,
    };
  },
});

export const create = mutation({
  args: {
    company_name: v.string(),
    oldId: v.optional(v.string()),
    icon: v.object({
      file_url: v.optional(v.string()),
      should_invert_on_dark: v.boolean(),
      version: v.number(),
      variant_id: v.optional(v.id("tech_icon_variant")),
    }),
    details: v.object({
      website_url: v.string(),
      category: categoryValidator,
      my_stack: v.boolean(),
      is_favorite: v.boolean(),
      use_case: v.string(),
      my_experience: v.string(),
      description: v.string(),
      purchased: v.boolean(),
      year_began_using: v.number(),
      monthBeganUsing: monthValidator,
      skill_level: ratingValidator,
      rating: ratingValidator,
      comment: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const techId = await ctx.db.insert("tech", {
      company_name: args.company_name,
      oldId: args.oldId,
    });

    await ctx.db.insert("techIcons", {
      tech_id: techId,
      file_url: args.icon.file_url,
      should_invert_on_dark: args.icon.should_invert_on_dark,
      version: args.icon.version,
      variant_id: args.icon.variant_id as any,
    });

    await ctx.db.insert("techDetails", {
      tech_id: techId,
      ...args.details,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return techId;
  },
});

export const update = mutation({
  args: {
    id: v.id("tech"),
    company_name: v.string(),
    oldId: v.optional(v.string()),
    icon: v.object({
      file_url: v.optional(v.string()),
      should_invert_on_dark: v.boolean(),
      version: v.number(),
      variant_id: v.optional(v.id("tech_icon_variant")),
    }),
    details: v.object({
      website_url: v.string(),
      category: categoryValidator,
      my_stack: v.boolean(),
      is_favorite: v.boolean(),
      use_case: v.string(),
      my_experience: v.string(),
      description: v.string(),
      purchased: v.boolean(),
      year_began_using: v.number(),
      monthBeganUsing: monthValidator,
      skill_level: ratingValidator,
      rating: ratingValidator,
      comment: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      company_name: args.company_name,
      oldId: args.oldId,
    });

    const existingIcon = await ctx.db
      .query("techIcons")
      .withIndex("by_tech_id", (q) => q.eq("tech_id", args.id))
      .first();
    if (existingIcon) {
      await ctx.db.patch(existingIcon._id, {
        file_url: args.icon.file_url,
        should_invert_on_dark: args.icon.should_invert_on_dark,
        version: args.icon.version,
        variant_id: args.icon.variant_id,
      });
    }

    const existingDetails = await ctx.db
      .query("techDetails")
      .withIndex("by_tech_id", (q) => q.eq("tech_id", args.id))
      .first();
    if (existingDetails) {
      await ctx.db.patch(existingDetails._id, {
        ...args.details,
        updatedAt: Date.now(),
      });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("tech") },
  handler: async (ctx, args) => {
    const icon = await ctx.db
      .query("techIcons")
      .withIndex("by_tech_id", (q) => q.eq("tech_id", args.id))
      .first();
    if (icon) await ctx.db.delete(icon._id);

    const details = await ctx.db
      .query("techDetails")
      .withIndex("by_tech_id", (q) => q.eq("tech_id", args.id))
      .first();
    if (details) await ctx.db.delete(details._id);

    await ctx.db.delete(args.id);
  },
});

export const listIconVariants = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tech_icon_variant").collect();
  },
});

export const addIconVariant = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tech_icon_variant", { name: args.name });
  },
});

export const updateIconByOldId = mutation({
  args: {
    oldId: v.string(),
    file_url: v.string(),
    should_invert_on_dark: v.boolean(),
    version: v.number(),
    variant_id: v.optional(v.id("tech_icon_variant")),
  },
  handler: async (ctx, args) => {
    const tech = await ctx.db
      .query("tech")
      .withIndex("by_oldId", (q) => q.eq("oldId", args.oldId))
      .first();
    
    if (!tech) {
      console.log(`[updateIconByOldId] Tech not found for oldId: ${args.oldId}`);
      return { success: false, error: "Tech not found" };
    }

    console.log(`[updateIconByOldId] Found tech ${tech._id} for oldId ${args.oldId}`);

    // Use compound index if variant_id is provided, otherwise fall back to tech_id only
    let existingIcon;
    if (args.variant_id) {
      existingIcon = await ctx.db
        .query("techIcons")
        .withIndex("by_tech_and_variant", (q) => 
          q.eq("tech_id", tech._id).eq("variant_id", args.variant_id)
        )
        .first();
    } else {
      // For icons without variant, find one without variant_id
      const allIcons = await ctx.db
        .query("techIcons")
        .withIndex("by_tech_id", (q) => q.eq("tech_id", tech._id))
        .collect();
      existingIcon = allIcons.find(icon => !icon.variant_id);
    }

    console.log(`[updateIconByOldId] Existing icon: ${existingIcon ? existingIcon._id : 'none'}`);
    console.log(`[updateIconByOldId] Variant ID: ${args.variant_id || 'none'}`);

    if (existingIcon) {
      console.log(`[updateIconByOldId] Updating existing icon ${existingIcon._id}`);
      await ctx.db.patch(existingIcon._id, {
        file_url: args.file_url,
        should_invert_on_dark: args.should_invert_on_dark,
        version: args.version,
      });
      return { success: true, action: 'updated', iconId: existingIcon._id };
    } else {
      console.log(`[updateIconByOldId] Creating new icon for tech ${tech._id} with variant ${args.variant_id}`);
      const newIconId = await ctx.db.insert("techIcons", {
        tech_id: tech._id,
        file_url: args.file_url,
        should_invert_on_dark: args.should_invert_on_dark,
        version: args.version,
        variant_id: args.variant_id,
      });
      console.log(`[updateIconByOldId] Created new icon ${newIconId}`);
      return { success: true, action: 'created', iconId: newIconId };
    }
  },
});

export const updateTechIconUrls = mutation({
  args: {
    tech_id: v.id("tech"),
    version: v.optional(v.number()),
    icons: v.array(v.object({
      variant_id: v.id("tech_icon_variant"),
      file_url: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    for (const iconData of args.icons) {
      // Check if icon already exists for this tech, variant, AND version
      const existingIcons = await ctx.db
        .query("techIcons")
        .withIndex("by_tech_and_variant", (q) =>
          q.eq("tech_id", args.tech_id).eq("variant_id", iconData.variant_id)
        )
        .collect();
      
      const targetVersion = args.version ?? 1;
      const existingIcon = existingIcons.find(i => i.version === targetVersion);

      if (existingIcon) {
        // Update existing icon for this specific version
        await ctx.db.patch(existingIcon._id, {
          file_url: iconData.file_url,
          // match version passed in
          version: targetVersion, 
        });
      } else {
        // Create new icon for this version
        await ctx.db.insert("techIcons", {
          tech_id: args.tech_id,
          file_url: iconData.file_url,
          variant_id: iconData.variant_id,
          should_invert_on_dark: false,
          version: targetVersion,
        });
      }
    }

    return { success: true, count: args.icons.length };
  },
});
