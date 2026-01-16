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
  
  // Fetch all active custom forms that have chatbot access enabled
  console.log("Fetching custom forms...");
  const forms = (await ctx.runQuery((api as any).myFunctions.getAllCustomForms)) as any[];
  const chatbotForms = forms?.filter(f => f.isActive && f.settings?.chatbotAccess === true) || [];
  
  // Build forms knowledge base
  let formsKnowledge = "";
  if (chatbotForms.length > 0) {
    formsKnowledge = "\n\n=== AVAILABLE FORMS ===\n";
    formsKnowledge += "When users ask about services, quotes, requests, or specific tasks, recommend the appropriate form from this list:\n\n";
    
    chatbotForms.forEach((form, index) => {
      formsKnowledge += `${index + 1}. **${form.name}** (${form.slug})\n`;
      if (form.description) {
        formsKnowledge += `   Description: ${form.description}\n`;
      }
      
      // Include field information to help match user intent
      if (form.fields && form.fields.length > 0) {
        const fieldTypes = form.fields.map((f: any) => f.type).filter((t: string, i: number, arr: string[]) => arr.indexOf(t) === i);
        formsKnowledge += `   Fields: ${fieldTypes.join(", ")}\n`;
      }
      formsKnowledge += "\n";
    });
    
    formsKnowledge += "CRITICAL INSTRUCTIONS FOR FORMS:\n";
    formsKnowledge += "1. NEVER provide a direct URL link to a form (e.g., do not write /forms/[slug]).\n";
    formsKnowledge += "2. Instead, ask the user: 'Would you like to fill out the [Form Name] form right here?'\n";
    formsKnowledge += "3. If the user expresses interest or says 'yes', 'sure', 'ok', etc., then include the following signal exactly in your response: [[SHOW_FORM:[slug]]]\n";
    formsKnowledge += "4. When you provide the signal, also say something polite like 'Great! I've loaded the form for you below.'\n\n";
  }
  
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

  // Combine knowledge bases
  const knowledgeBase = settings 
    ? `${settings.knowledgeBase}${formsKnowledge}` 
    : `${websiteSourceMap}${formsKnowledge}`;

  try {
    const response = await openai.chat.completions.create({
      model: model,
      temperature: temperature,
      messages: [
        {
          role: "system",
          content: `${systemPrompt}\n\nKNOWLEDGE BASE:\n${knowledgeBase}`,
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
