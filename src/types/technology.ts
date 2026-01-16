
import { Id } from "~/convex/_generated/dataModel";

export type Month = "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec" | "";
export type Rating = "1" | "2" | "3" | "4" | "5" | "";

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

export type Category = (typeof CATEGORIES)[number] | "";

export interface ITechnologyFormIcon {
  file_url?: string;
  should_invert_on_dark: boolean;
  version: number;
  variant_id?: string;
}

export interface ITechnologyFormDetails {
  website_url: string;
  category: Category;
  my_stack: boolean;
  is_favorite: boolean;
  use_case: string;
  my_experience: string;
  description: string;
  purchased: boolean;
  year_began_using: number;
  monthBeganUsing?: Month;
  skill_level?: Rating;
  rating?: Rating;
  comment: string;
}

export interface ITechnologyFormValues {
  company_name: string;
  icon: ITechnologyFormIcon;
  details: ITechnologyFormDetails;
}

export interface ITechnologyWithMeta extends ITechnologyFormValues {
  _id: Id<"tech">;
  allIcons?: any[];
  variants?: any[];
  oldId?: string;
}
