import { z } from "zod";

export const batchSchema = z.object({
  name: z
    .string()
    .min(2, "Batch name is required")
    .max(100, "Batch name too long")
    .trim(),

  capacity: z.coerce.number().optional().nullable(),

  teacherName: z.string(),
});

export type BatchInput = z.infer<typeof batchSchema>;
