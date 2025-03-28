import { z } from "zod";

export const journalEntrySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  content: z
    .string()
    .min(4, "Content must be at least 4 characters")
    .max(5000, "Content is too long"),
});

export type JournalEntryInput = z.infer<typeof journalEntrySchema>;
