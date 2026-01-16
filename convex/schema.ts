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

  media: defineTable({
    storageId: v.string(), // ID from Convex file storage
    url: v.string(),
    name: v.string(),
    type: v.string(), // MIME type
    size: v.number(),
    folderId: v.optional(v.id("media_folders")),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
  })
  .index("by_createdAt", ["createdAt"])
  .index("by_folderId", ["folderId"])
  .index("by_tags", ["tags"]),

  media_folders: defineTable({
    name: v.string(),
    parentId: v.optional(v.id("media_folders")),
    createdAt: v.number(),
  })
  .index("by_parentId", ["parentId"]),

  custom_forms: defineTable({
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
        v.literal("date_range"),
        v.literal("richtext"),
        v.literal("color_picker")
      ),
      required: v.boolean(),
      content: v.optional(v.string()), // For Rich Text and other static content
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
        fieldId: v.optional(v.string()),
        operator: v.optional(v.union(v.literal("eq"), v.literal("neq"), v.literal("contains"), v.literal("gt"), v.literal("lt"), v.literal("is_empty"), v.literal("is_not_empty"))),
        value: v.optional(v.string())
      })),
      validation: v.optional(v.object({
        min: v.optional(v.number()),
        max: v.optional(v.number())
      })),
      // Email Config
      emailConfig: v.optional(v.object({
        businessOnly: v.optional(v.boolean())
      })),
      // Address specific config
      addressConfig: v.optional(v.object({
        autoComplete: v.optional(v.boolean()),
        apiKeyEnvName: v.optional(v.string()),
        outputFormat: v.optional(v.union(v.literal("default"), v.literal("google"), v.literal("stripe"))),
        verifyAddress: v.optional(v.boolean())
      })),
      // Phone Config
      phoneConfig: v.optional(v.object({
        format: v.optional(v.union(v.literal("pretty"), v.literal("standard"), v.literal("basic"))),
        international: v.optional(v.boolean()),
        showFlags: v.optional(v.boolean())
      })),
      // Textarea Config
      textareaConfig: v.optional(v.object({
        rows: v.optional(v.number()),
        resizable: v.optional(v.boolean())
      })),
      // Slider Config
      sliderConfig: v.optional(v.object({
        min: v.optional(v.number()),
        max: v.optional(v.number()),
        step: v.optional(v.number()),
        unit: v.optional(v.union(v.literal("number"), v.literal("percent"), v.literal("currency")))
      })),
      // Image Config
      imageConfig: v.optional(v.object({
        src: v.optional(v.string()),
        alt: v.optional(v.string()),
        width: v.optional(v.number()),
        height: v.optional(v.number()),
        allowUpload: v.optional(v.boolean()),
        maxSize: v.optional(v.number()) 
      })),
      // File Upload Config
      fileConfig: v.optional(v.object({
        allowedTypes: v.optional(v.array(v.string())),
        maxFiles: v.optional(v.number()),
        maxSize: v.optional(v.number())
      })),
      // Flex Row Config
      flexConfig: v.optional(v.object({
        justify: v.optional(v.union(v.literal("start"), v.literal("center"), v.literal("end"), v.literal("between"), v.literal("around"))),
        align: v.optional(v.union(v.literal("start"), v.literal("center"), v.literal("end"), v.literal("stretch"))),
        gap: v.optional(v.number())
      })),
      // Star Rating Config
      starRatingConfig: v.optional(v.object({
        maxStars: v.optional(v.number()),
        defaultValue: v.optional(v.number())
      })),
      // Date Range Config
      dateRangeConfig: v.optional(v.object({
        allowSameDay: v.optional(v.boolean())
      }))
    })),
    settings: v.optional(v.object({
      isConsecutive: v.optional(v.boolean()),
      completionEmail: v.optional(v.string()), // Email template to send on completion
      chatbotAccess: v.optional(v.boolean()) // Allow chatbot to recommend this form
    })),
    // Open Graph metadata for sharing
    ogMetadata: v.optional(v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      image: v.optional(v.string()),
      imageAlt: v.optional(v.string())
    })),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),
  
  form_submissions: defineTable({
    formId: v.id("custom_forms"),
    formName: v.string(),
    submitterEmail: v.optional(v.string()),
    submitterName: v.optional(v.string()),
    data: v.any(), // The actual form data submitted
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_form", ["formId"])
    .index("by_read", ["isRead"])
    .index("by_created", ["createdAt"]),
  
  // Track form analytics - views, starts, completions, bounces
  form_analytics: defineTable({
    formId: v.id("custom_forms"),
    eventType: v.union(
      v.literal("view"),      // Form was viewed
      v.literal("start"),     // User started filling form
      v.literal("complete"),  // Form was completed
      v.literal("bounce")     // User started but didn't complete
    ),
    sessionId: v.optional(v.string()), // Track unique sessions
    userAgent: v.optional(v.string()),
    referrer: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_form", ["formId"])
    .index("by_event", ["eventType"])
    .index("by_form_and_event", ["formId", "eventType"])
    .index("by_created", ["createdAt"]),
  
  // SEO Metadata management for pages
  seo_metadata: defineTable({
    pagePath: v.string(), // e.g., "/", "/about", "/blog/[slug]", "/forms/[slug]"
    pageTitle: v.string(), // <title> tag
    metaDescription: v.string(), // meta description
    keywords: v.optional(v.array(v.string())), // meta keywords
    ogTitle: v.optional(v.string()), // Open Graph title (defaults to pageTitle)
    ogDescription: v.optional(v.string()), // OG description (defaults to metaDescription)
    ogImage: v.optional(v.string()), // OG image URL
    ogImageAlt: v.optional(v.string()), // OG image alt text
    twitterCard: v.optional(v.union(
      v.literal("summary"),
      v.literal("summary_large_image"),
      v.literal("app"),
      v.literal("player")
    )),
    twitterTitle: v.optional(v.string()),
    twitterDescription: v.optional(v.string()),
    twitterImage: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()), // Canonical URL
    robots: v.optional(v.string()), // e.g., "index, follow" or "noindex, nofollow"
    isActive: v.boolean(), // Enable/disable SEO for this page
    priority: v.optional(v.number()), // For sitemap.xml (0.0 to 1.0)
    changeFrequency: v.optional(v.union(
      v.literal("always"),
      v.literal("hourly"),
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("monthly"),
      v.literal("yearly"),
      v.literal("never")
    )),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_path", ["pagePath"])
    .index("by_active", ["isActive"]),
});
