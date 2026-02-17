import { z } from "zod";

const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);

export const studentSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.email("Invalid email").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: GenderEnum.optional(),
  batchId: z.string().min(1, "Batch ID is required"),
});

export type StudentInput = z.infer<typeof studentSchema>;