import { z } from "zod";

export const studentSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  // Allow empty string to pass as optional
  email: z.email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  batchId: z.string().min(1, "Batch ID is required"),
});

export type StudentInput = z.infer<typeof studentSchema>;