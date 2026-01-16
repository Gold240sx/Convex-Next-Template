import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { ConversationMessage } from "../../src/types/messages";

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
