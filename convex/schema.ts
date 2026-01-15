import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,

  posts: defineTable({
    text: v.string(),
    authorEmail: v.string(),
    authorId: v.id("users"),
  })
    .index("by_authorEmail", ["authorEmail"])
    .index("by_authorId", ["authorId"]),

  contact_form: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string()
  }).index("by_email", ["email"]),
});
