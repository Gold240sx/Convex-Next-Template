import * as z from "zod";

export const monthEnum = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const ratingEnum = ["1", "2", "3", "4", "5"] as const;

export const CATEGORIES = [
  "UI Lib",
  "AI",
  "Database",
  "API's",
  "iOS/mobile dev",
  "Backend",
  "Framework",
  "Library",
  "Version Control",
  "Authentication",
  "Web",
  "Backend Tooling",
  "Css Framework",
  "Email",
  "ORM/RDBMS",
  "Low-Code / No Code / VibeCode",
  "Design",
  "Animation",
  "Language",
  "CMS",
  "Testing",
] as const;

export const categoryEnum = CATEGORIES;
export type Category = (typeof CATEGORIES)[number];

export const technologySchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  icon: z.object({
    file_url: z.string().optional(),
    should_invert_on_dark: z.boolean(),
    version: z.number(),
    variant_id: z.string().optional(),
  }),
  details: z.object({
    website_url: z.string().url("Must be a valid URL").or(z.literal("")),
    category: z.enum(categoryEnum).or(z.literal("")).refine((val): val is Category => val !== "", "Category is required"),
    my_stack: z.boolean(),
    is_favorite: z.boolean(),
    use_case: z.string(),
    my_experience: z.string(),
    description: z.string(),
    purchased: z.boolean(),
    year_began_using: z.coerce.number().int().min(1900).max(new Date().getFullYear()),
    monthBeganUsing: z.enum(monthEnum).optional().or(z.literal("")),
    skill_level: z.enum(ratingEnum).optional().or(z.literal("")),
    rating: z.enum(ratingEnum).optional().or(z.literal("")),
    comment: z.string(),
  }),
});

export type TechnologyFormValues = z.infer<typeof technologySchema>;
