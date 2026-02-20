"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { attendanceSchema } from "../validations/attendanceValidator";
import prisma from "../prisma";

export async function MarkAttendance(formData: FormData) {
  const { orgId, userId } = await auth();

  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  const date = formData.get("date") as string;
  const batchId = formData.get("batchId") as string;

  const studentIds = formData.getAll("studentId") as string[];
  const records = studentIds.map((studentId) => ({
    studentId,
    status: formData.get(`status-${studentId}`) as string,
  }));

  const result = attendanceSchema.safeParse({
    date,
    batchId,
    records,
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0].message,
    };
  }

  const data = result.data;

  try {
    await prisma.$transaction(
      data.records.map((record) =>
        prisma.attendance.upsert({
          where: {
            studentId_date: {
              studentId: record.studentId,
              date: data.date,
            },
          },
          update: {
            status: record.status,
          },
          create: {
            studentId: record.studentId,
            batchId: data.batchId,
            date: data.date,
            status: record.status,
            orgId,
          },
        }),
      ),
    );

    revalidatePath(`/dashboard/batches/${data.batchId}/attendance`);

    return {
      success: true,
      message: "Attendance marked successfully",
    };
  } catch (error) {
    console.error("Attendance error:", error);
    return {
      success: false,
      error: "Something went wrong",
    };
  }
}

export async function GetAttendance(batchId: string, date: string) {
  const { orgId, userId } = await auth();

  if (!userId || !orgId) {
    redirect("/sign-in");
  }

  try {
    const attendance = await prisma.attendance.findMany({
      where: {
        batchId,
        date,
        orgId,
      },
      include: {
        student: true,
      },
    });

    return attendance;
  } catch (error) {
    console.error("Get attendance error:", error);
    return [];
  }
}
