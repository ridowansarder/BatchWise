import { z } from "zod";

export const batchSchema = z.object({
  name: z
    .string()
    .min(2, "Batch name is required")
    .max(100, "Batch name too long")
    .trim(),

  capacity: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => val === undefined || (!isNaN(val) && val > 0), {
      message: "Capacity must be a positive number",
    }),

  teacherName: z.string(),
});
