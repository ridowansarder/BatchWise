import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { AttendanceForm } from "@/components/AttendanceForm";

const AttendancePage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ batchId: string }>;
  searchParams: { date?: string };
}) => {
  const { orgId } = await auth();
  const { batchId } = await params;

  // Default to today's date
  const selectedDate = searchParams.date || new Date().toISOString().split("T")[0];

  const batch = await prisma.batch.findUnique({
    where: { id: batchId, orgId: orgId || undefined },
    include: {
      students: {
        orderBy: { firstName: "asc" },
      },
    },
  });

  if (!batch) notFound();

  // Fetch existing attendance for the selected date
  const attendanceDate = new Date(selectedDate);
  const existingAttendance = await prisma.attendance.findMany({
    where: {
      batchId,
      date: attendanceDate,
      orgId: orgId || undefined,
    },
  });

  // Create a map of studentId -> status for easy lookup
  const attendanceMap = new Map(
    existingAttendance.map((a) => [a.studentId, a.status])
  );

  // Map students to include studentId field
  const studentsWithId = batch.students.map((student) => ({
    ...student,
    studentId: student.id,
  }));

  return (
    <div className="py-6 px-12 space-y-5 w-full">
      <div>
        <h1 className="text-2xl font-semibold">Mark Attendance</h1>
        <p className="text-muted-foreground mt-1">
          {batch.name} — {batch.students.length}{" "}
          {batch.students.length === 1 ? "student" : "students"}
        </p>
      </div>

      <AttendanceForm
        batchId={batchId}
        students={studentsWithId}
        selectedDate={selectedDate}
        existingAttendance={attendanceMap}
      />
    </div>
  );
};

export default AttendancePage;