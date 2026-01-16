import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConversationMessage } from "../src/types/messages";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

// Read
export const getUsersPosts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return [];
    }
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
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

// Write
export const createPost = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }
    const identity = await ctx.auth.getUserIdentity();
    await ctx.db.insert("posts", {
      text: args.text,
      authorId: userId,
      authorEmail: identity?.email ?? "Unknown",
    });
  },
});

export const submitContactForm = mutation({
  args: { name: v.string(), email: v.string(), message: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("contact_form", {
      name: args.name,
      email: args.email,
      message: args.message,
    });
  },
});

export const submitChatbotMessageForm = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),

    subject: v.optional(v.string()),
    contactReason: v.optional(v.union(
      v.literal("general"),
      v.literal("project_inquiry"),
      v.literal("support"),
      v.literal("feedback"),
      v.literal("partnership"),
    )),
    conversation: v.optional(v.object({
      summary: v.optional(v.string()),
      messages: v.array(v.object({
        role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
        content: v.string(),
        createdAt: v.number(),
      }))
    })),
    consent: v.boolean(),
  },


  handler: async (ctx, args) => {
    if (args.conversation?.messages && args.conversation.messages.length > 500) {
      throw new Error("Conversation too long");
    }

    args.conversation?.messages?.forEach((m: ConversationMessage) => {
      if (m.content.length > 8000) {
        throw new Error("Message too long");
      }
    });
    await ctx.db.insert("contactMessages", {
      ...args,
      consent: true,
      createdAt: Date.now(),
    });
  },
});


export const getAllContactMessages = query({
  args: {},
  handler: async (ctx) => {
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
    return await ctx.db.get(args.id);
  },
});

export const markContactMessageAsRead = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      readAt: Date.now(),
    });
  },
});

export const markContactMessageAsUnread = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      readAt: null,
      archivedAt: null, // Move back to inbox if it was archived
    });
  },
});

export const archiveContactMessage = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { archivedAt: Date.now() });
  },
});

export const unarchiveContactMessage = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { archivedAt: null });
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
    const userId = await getAuthUserId(ctx);
    return await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      priority: args.priority,
      status: "todo",
      sourceType: "message",
      sourceId: args.messageId,
      authorId: userId ?? undefined,
      createdAt: Date.now(),
      dueDate: args.dueDate,
      reminder: args.reminder,
    });
  },
});

export const getTasks = query({
  args: {},
  handler: async (ctx) => {
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

export const updateTaskStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(v.literal("todo"), v.literal("in_progress"), v.literal("done"))
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const archiveTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { archivedAt: Date.now() });
  },
});

export const unarchiveTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
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
    await ctx.db.patch(id, updates);
  },
});

export const getChatbotSettings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("chatbot_settings").first();
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

export const getSiteContent = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("site_content")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
  },
});

export const updateSiteContent = mutation({
  args: { key: v.string(), content: v.string() },
  handler: async (ctx, args) => {
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

// Custom Forms

export const getCustomForms = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("custom_forms").order("desc").collect();
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

export const getCustomFormById = query({
  args: { id: v.id("custom_forms") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createCustomForm = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    slug: v.string(),
    fields: v.array(v.object({
      id: v.string(),
      label: v.string(),
      type: v.union(
        v.literal("text"), 
        v.literal("email"), 
        v.literal("textarea"), 
        v.literal("select"), 
        v.literal("number"),
        v.literal("phone"),
        v.literal("regex"),
        v.literal("boolean"),
        v.literal("date"),
        v.literal("radio"),
        v.literal("checkbox"),
        v.literal("condition_block"),
        v.literal("address"),
        v.literal("title"),
        v.literal("subtitle"),
        v.literal("separator"),
        v.literal("stepper"),
        v.literal("input_group"),
        v.literal("slider"),
        v.literal("image"),
        v.literal("file_upload"),
        v.literal("flex_row"),
        v.literal("star_rating"),
        v.literal("happiness_rating"),
        v.literal("date_range")
      ),
      required: v.boolean(),
      options: v.optional(v.array(v.string())),
      placeholder: v.optional(v.string()),
      regexPattern: v.optional(v.string()),
      helpText: v.optional(v.string()),
      stepTitle: v.optional(v.string()),
      conditions: v.optional(v.array(v.object({
        fieldId: v.string(),
        operator: v.union(v.literal("eq"), v.literal("neq")),
        value: v.string()
      }))),
      children: v.optional(v.array(v.any())),
      conditionRule: v.optional(v.object({
        fieldId: v.string(),
        operator: v.union(v.literal("eq"), v.literal("neq"), v.literal("contains"), v.literal("gt"), v.literal("lt")),
        value: v.string()
      })),
      validation: v.optional(v.object({
        min: v.optional(v.number()),
        max: v.optional(v.number())
      })),
      addressConfig: v.optional(v.object({
        autoComplete: v.optional(v.boolean()),
        apiKeyEnvName: v.optional(v.string()),
        outputFormat: v.optional(v.union(v.literal("default"), v.literal("google"), v.literal("stripe"))),
        verifyAddress: v.optional(v.boolean())
      })),
      phoneConfig: v.optional(v.object({
        format: v.optional(v.union(v.literal("pretty"), v.literal("standard"), v.literal("basic"))),
        international: v.optional(v.boolean()),
        showFlags: v.optional(v.boolean())
      })),
      textareaConfig: v.optional(v.object({
        rows: v.optional(v.number()),
        resizable: v.optional(v.boolean())
      })),
      sliderConfig: v.optional(v.object({
        min: v.optional(v.number()),
        max: v.optional(v.number()),
        step: v.optional(v.number())
      })),
      imageConfig: v.optional(v.object({
        src: v.optional(v.string()),
        alt: v.optional(v.string()),
        width: v.optional(v.number()),
        height: v.optional(v.number())
      })),
      fileConfig: v.optional(v.object({
        allowedTypes: v.optional(v.array(v.string())),
        maxFiles: v.optional(v.number())
      })),
      flexConfig: v.optional(v.object({
        justify: v.optional(v.union(v.literal("start"), v.literal("center"), v.literal("end"), v.literal("between"), v.literal("around"))),
        align: v.optional(v.union(v.literal("start"), v.literal("center"), v.literal("end"), v.literal("stretch"))),
        gap: v.optional(v.number())
      })),
      starRatingConfig: v.optional(v.object({
        maxStars: v.optional(v.number())
      })),
      dateRangeConfig: v.optional(v.object({
        allowSameDay: v.optional(v.boolean())
      }))
    })),
    isActive: v.boolean(),
    settings: v.optional(v.object({
      isConsecutive: v.optional(v.boolean()),
      completionEmail: v.optional(v.string())
    }))
  },
  handler: async (ctx, args) => {
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

export const updateCustomForm = mutation({
  args: {
    id: v.id("custom_forms"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    slug: v.optional(v.string()),
    fields: v.optional(v.array(v.object({
      id: v.string(),
      label: v.string(),
      type: v.union(
        v.literal("text"), 
        v.literal("email"), 
        v.literal("textarea"), 
        v.literal("select"), 
        v.literal("number"),
        v.literal("phone"),
        v.literal("regex"),
        v.literal("boolean"),
        v.literal("date"),
        v.literal("radio"),
        v.literal("checkbox"),
        v.literal("condition_block"),
        v.literal("address"),
        v.literal("title"),
        v.literal("subtitle"),
        v.literal("separator"),
        v.literal("text"),
        v.literal("email"),
        v.literal("textarea"),
        v.literal("select"),
        v.literal("number"),
        v.literal("phone"),
        v.literal("regex"),
        v.literal("boolean"),
        v.literal("date"),
        v.literal("radio"),
        v.literal("checkbox"),
        v.literal("condition_block"),
        v.literal("address"),
        v.literal("title"),
        v.literal("subtitle"),
        v.literal("separator"),
        v.literal("stepper"),
        v.literal("input_group"),
        v.literal("slider"),
        v.literal("image"),
        v.literal("file_upload"),
        v.literal("flex_row"),
        v.literal("star_rating"),
        v.literal("happiness_rating"),
        v.literal("date_range")
      ),
      required: v.boolean(),
      options: v.optional(v.array(v.string())),
      placeholder: v.optional(v.string()),
      regexPattern: v.optional(v.string()),
      helpText: v.optional(v.string()),
      stepTitle: v.optional(v.string()),
      conditions: v.optional(v.array(v.object({
        fieldId: v.string(),
        operator: v.union(v.literal("eq"), v.literal("neq")),
        value: v.string()
      }))),
      children: v.optional(v.array(v.any())),
      conditionRule: v.optional(v.object({
        fieldId: v.string(),
        operator: v.union(v.literal("eq"), v.literal("neq"), v.literal("contains"), v.literal("gt"), v.literal("lt")),
        value: v.string()
      })),
      validation: v.optional(v.object({
        min: v.optional(v.number()),
        max: v.optional(v.number())
      })),
      addressConfig: v.optional(v.object({
        autoComplete: v.optional(v.boolean()),
        apiKeyEnvName: v.optional(v.string()),
        outputFormat: v.optional(v.union(v.literal("default"), v.literal("google"), v.literal("stripe"))),
        verifyAddress: v.optional(v.boolean())
      })),
      phoneConfig: v.optional(v.object({
        format: v.optional(v.union(v.literal("pretty"), v.literal("standard"), v.literal("basic"))),
        international: v.optional(v.boolean()),
        showFlags: v.optional(v.boolean())
      })),
      textareaConfig: v.optional(v.object({
        rows: v.optional(v.number()),
        resizable: v.optional(v.boolean())
      })),
      sliderConfig: v.optional(v.object({
        min: v.optional(v.number()),
        max: v.optional(v.number()),
        step: v.optional(v.number())
      })),
      imageConfig: v.optional(v.object({
        src: v.optional(v.string()),
        alt: v.optional(v.string()),
        width: v.optional(v.number()),
        height: v.optional(v.number())
      })),
      fileConfig: v.optional(v.object({
        allowedTypes: v.optional(v.array(v.string())),
        maxFiles: v.optional(v.number())
      })),
      flexConfig: v.optional(v.object({
        justify: v.optional(v.union(v.literal("start"), v.literal("center"), v.literal("end"), v.literal("between"), v.literal("around"))),
        align: v.optional(v.union(v.literal("start"), v.literal("center"), v.literal("end"), v.literal("stretch"))),
        gap: v.optional(v.number())
      })),
      starRatingConfig: v.optional(v.object({
        maxStars: v.optional(v.number())
      })),
      dateRangeConfig: v.optional(v.object({
        allowSameDay: v.optional(v.boolean())
      }))
    }))),
    isActive: v.optional(v.boolean()),
    settings: v.optional(v.object({
      isConsecutive: v.optional(v.boolean()),
      completionEmail: v.optional(v.string())
    }))
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const deleteCustomForm = mutation({
  args: { id: v.id("custom_forms") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Actions

