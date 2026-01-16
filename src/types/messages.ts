export type ConversationMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: number;
};

export type Conversation = {
  summary?: string;
  messages: ConversationMessage[];
};
