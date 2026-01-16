import { v } from "convex/values";
import { action, ActionCtx } from "./_generated/server";
import { api } from "./_generated/api";
import OpenAI from "openai";
import { websiteSourceMap } from "./chatbotData/websiteSourceMap";
import { rateLimiter } from "./rateLimiter";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConversationMessage } from "../src/types/messages";

import { Doc } from "./_generated/dataModel";

type ChatArgs = {
  messages: Pick<ConversationMessage, "role" | "content">[];
};

const chatHandler = async (ctx: ActionCtx, args: ChatArgs): Promise<string | null> => {
  const userId = await getAuthUserId(ctx);
  const userKey = userId ?? "anonymous";
  // Rate limit by userId if logged in, otherwise use a global identifier or leave blank for a global limit
  await rateLimiter.limit(ctx, "chat", { key: userKey, throws: true });

  // Pre-flight check for tokens
  const lastMessage = args.messages[args.messages.length - 1]?.content ?? "";
  const estimatedTokens = Math.ceil(lastMessage.length / 4) + 500; 
  await rateLimiter.check(ctx, "tokenUsage", { key: userKey, count: estimatedTokens, throws: true });
  await rateLimiter.check(ctx, "globalTokenUsage", { count: estimatedTokens, throws: true });

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  console.log("Fetching chatbot settings from database...");
  const settings = (await ctx.runQuery((api as any).myFunctions.getChatbotSettings)) as Doc<"chatbot_settings"> | null;
  
  if (settings) {
    console.log("Using database settings:", settings.model);
  } else {
    console.log("No database settings found. Falling back to hardcoded defaults.");
  }
  
  const systemPrompt = settings?.systemPrompt ?? `You are a helpful assistant for Michael Martell's website. 
  Use the provided website information to answer user questions. 
  If you cannot find the answer, be honest and polite.`;

  const model = settings?.model ?? "gpt-4o-mini";
  const temperature = settings?.temperature ?? 0.7;

  try {
    const response = await openai.chat.completions.create({
      model: model,
      temperature: temperature,
      messages: [
        {
          role: "system",
          content: settings ? `${systemPrompt}\n\nKNOWLEDGE BASE:\n${settings.knowledgeBase}` : `${systemPrompt}\n\nKNOWLEDGE BASE:\n${websiteSourceMap}`,
        },
        ...args.messages.map((m) => ({
          role: m.role,
          content: m.content
        })),
      ],
    });

    const usage = response.usage;
    if (usage) {
      // Track actual usage
      await rateLimiter.limit(ctx, "tokenUsage", { key: userKey, count: usage.total_tokens, reserve: true });
      await rateLimiter.limit(ctx, "globalTokenUsage", { count: usage.total_tokens, reserve: true });
    }

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Error:", error);
    throw new Error("Failed to get response from AI");
  }
};

export const chat = action({
  args: {
    messages: v.array(
      v.object({
        role: v.union(
          v.literal("user"),
          v.literal("assistant"),
          v.literal("system")
        ),
        content: v.string(),
      })
    ),
  },
  handler: chatHandler,
});
