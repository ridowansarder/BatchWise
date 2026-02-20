import { z } from "zod";

const AttendanceStatusEnum = z.enum(["PRESENT", "ABSENT", "LATE"]);

export const attendanceSchema = z.object({
  date: z.coerce.date(),
  batchId: z.string().min(1, "Batch ID is required"),
  records: z.array(
    z.object({
      studentId: z.string().min(1, "Student ID is required"),
      status: AttendanceStatusEnum,
    })
  ),
});

export type AttendanceInput = z.infer<typeof attendanceSchema>;