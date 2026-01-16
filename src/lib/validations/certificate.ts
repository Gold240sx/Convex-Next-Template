import * as z from "zod";
import { monthEnum } from "./technology";

export const certificateSchema = z.object({
  ref_id: z.string().min(1, "Reference ID is required"),
  name: z.string().min(1, "Name is required"),
  instructor: z.string().min(1, "Instructor is required"),
  platform: z.string().min(1, "Platform is required"),
  course_link: z.string().url().or(z.literal("")),
  tech: z.array(z.string()),
  description: z.string(),
  certificate_link: z.string().url().or(z.literal("")),
  completed_month: z.enum(monthEnum),
  completed_year: z.coerce.number().int().min(1900),
  tags: z.array(z.string()),
  current_course: z.boolean().default(false),
  est_completion: z.coerce.number().default(0),
  modules: z.any().default([]),
  image: z.string().or(z.literal("")),
});

export type CertificateFormValues = z.infer<typeof certificateSchema>;
