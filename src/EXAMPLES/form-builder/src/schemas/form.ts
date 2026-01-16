import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(4).max(255),
  description: z.string().optional(),
});

type formSchemaType = z.infer<typeof formSchema>;

export { formSchema, type formSchemaType };
