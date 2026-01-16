import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export const technologiesTable = defineTable({
  name: v.string(),
  description: v.string(),
  image: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
});

export const ratingValidator = v.union(
  v.literal(""),
  v.literal("1"),
  v.literal("2"),
  v.literal("3"),
  v.literal("4"),
  v.literal("5"),
);

export const monthValidator = v.union(
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

export const categoryValidator = v.union(
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

//MARK: - Schema

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,

  posts: defineTable({
    text: v.string(),
    authorId: v.string(),
    authorEmail: v.string(),
  }).index("by_authorId", ["authorId"]),

  tech: defineTable({
    company_name: v.string(),
    oldId: v.optional(v.string()),
  })
  .index("by_company_name", ["company_name"])
  .index("by_oldId", ["oldId"]),

  tech_icon_variant: defineTable({
    name: v.string(),
  }),

  techIcons: defineTable({
    tech_id: v.id("tech"), // references the tech table
    file_url: v.optional(v.string()),
    should_invert_on_dark: v.boolean(),
    version: v.number(),
    variant_id: v.optional(v.id("tech_icon_variant"))
  })
  .index("by_tech_id", ["tech_id"])
  .index("by_variant_id", ["variant_id"])
  .index("by_tech_and_variant", ["tech_id", "variant_id"]),

  techDetails: defineTable({
    tech_id: v.id("tech"),
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_tech_id", ["tech_id"])
  .index("by_category", ["category"])
  .index("by_my_stack", ["my_stack"])
  .index("by_is_favorite", ["is_favorite"])
  .index("by_use_case", ["use_case"])
  .index("by_my_experience", ["my_experience"])
  .index("by_skill_level", ["skill_level"]),

  contact_form: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string()
  }).index("by_email", ["email"]),

  certificates: defineTable({
    ref_id: v.string(),
    name: v.string(),
    instructor: v.string(),
    platform: v.string(),
    course_link: v.string(),
    tech: v.array(v.string()),
    description: v.string(),
    certificate_link: v.string(),
    completed_month: monthValidator,
    completed_year: v.number(),
    tags: v.array(v.string()),
    current_course: v.boolean(),
    est_completion: v.number(),
    modules: v.any(),
    image: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_name", ["name"])
  .index("by_tags", ["tags"])
  .index("by_tech", ["tech"])
  .index("by_current_course", ["current_course"]),

   contactMessages: defineTable({
    // Core contact info
    name: v.string(),
    email: v.string(),

    subject: v.optional(v.string()),
    message: v.string(),

    company: v.optional(v.string()),
    phone: v.optional(v.string()),

    contactReason: v.optional(
      v.union(
        v.literal("general"),
        v.literal("project_inquiry"),
        v.literal("support"),
        v.literal("feedback"),
        v.literal("partnership"),
      )
    ),

    // Optional conversation transcript
    conversation: v.optional(
      v.object({
        summary: v.optional(v.string()),

        messages: v.array(
          v.object({
            role: v.union(
              v.literal("user"),
              v.literal("assistant"),
              v.literal("bot"),
              v.literal("system"),
            ),
            content: v.string(),
            createdAt: v.number(), // Date.now()
          })
        ),
      })
    ),

    // Compliance
    consent: v.boolean(),

    // Metadata / anti-spam / analytics
    metadata: v.optional(
      v.object({
        ipAddress: v.optional(v.string()),
        userAgent: v.optional(v.string()),
        referrer: v.optional(v.string()),
      })
    ),

    // Lifecycle fields
    createdAt: v.number(),
    readAt: v.optional(v.union(v.number(), v.null())),
    repliedAt: v.optional(v.number()),
    archivedAt: v.optional(v.union(v.number(), v.null())),
  })
    // Indexes for admin inbox & filtering
    .index("by_createdAt", ["createdAt"])
    .index("by_email", ["email"])
    .index("by_contactReason", ["contactReason"]),

  tasks: defineTable({
    title: v.string(),
    description: v.string(),
    priority: v.union(
      v.literal("low"), 
      v.literal("medium"), 
      v.literal("high")
    ),
    status: v.union(
      v.literal("todo"), 
      v.literal("in_progress"), 
      v.literal("done")
    ),
    sourceType: v.literal("message"),
    sourceId: v.id("contactMessages"),
    authorId: v.optional(v.string()),
    createdAt: v.number(),
    dueDate: v.optional(v.number()),
    reminder: v.optional(v.number()),
    archivedAt: v.optional(v.union(v.number(), v.null())),
  }).index("by_status", ["status"]),

  chatbot_settings: defineTable({
    systemPrompt: v.string(),
    knowledgeBase: v.string(),
    model: v.string(),
    temperature: v.number(),
    lastUpdated: v.number(),
  }),

  site_content: defineTable({
    key: v.string(),
    content: v.string(),
    lastUpdated: v.number(),
  }).index("by_key", ["key"]),
});
