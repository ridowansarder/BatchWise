import { z } from "zod";

export const batchSchema = z.object({
  name: z
    .string()
    .min(2, "Batch name must be at least 2 characters")
    .max(100, "Batch name is too long")
    .trim(),
  capacity: z.coerce
    .number()
    .positive("Capacity must be positive")
    .optional()
    .nullable(),
  teacherName: z.string().trim().min(2, "Teacher name is required"),
  teacherId: z.string().optional().nullable(),
});

export type BatchInput = z.infer<typeof batchSchema>;
