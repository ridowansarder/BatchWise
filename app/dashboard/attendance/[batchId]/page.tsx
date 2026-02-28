import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { AttendanceForm } from "@/components/AttendanceForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const BatchAttendancePage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ batchId: string }>;
  searchParams: { date?: string };
}) => {
  const { orgId } = await auth();
  if (!orgId) notFound();

  const { batchId } = await params;
  const selectedDate =
    searchParams.date || new Date().toISOString().split("T")[0];

  const batch = await prisma.batch.findUnique({
    where: {
      id: batchId,
      orgId,
    },
    include: {
      students: { orderBy: { firstName: "asc" } },
    },
  });

  if (!batch) notFound();

  const [year, month, day] = selectedDate.split("-").map(Number);
  const attendanceDate = new Date(Date.UTC(year, month - 1, day));

  const existingAttendance = await prisma.attendance.findMany({
    where: {
      batchId,
      orgId,
      date: attendanceDate,
    },
  });

  const attendanceMap = new Map(
    existingAttendance.map((a) => [a.studentId, a.status]),
  );

  const studentsWithId = batch.students.map((student) => ({
    ...student,
    studentId: student.id,
  }));

  const presentCount = existingAttendance.filter(
    (a) => a.status === "PRESENT",
  ).length;

  const absentCount = existingAttendance.filter(
    (a) => a.status === "ABSENT",
  ).length;

  const isMarked = existingAttendance.length > 0;

  return (
    <div className="py-6 px-6 sm:px-12 space-y-6 max-w-3xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Mark Attendance</h1>
          <p className="text-muted-foreground mt-1">
            {batch.name} —{" "}
            {new Date(attendanceDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            })}
          </p>
        </div>
        {isMarked && <Badge variant="secondary">Already marked</Badge>}
      </div>

      <Button asChild>
        <Link href={`/dashboard/attendance/${batchId}/history`}>
          Attendance History
        </Link>
      </Button>

      {isMarked && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-5">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-3xl font-bold mt-1">{batch.students.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <p className="text-sm text-muted-foreground">Present</p>
              <p className="text-3xl font-bold mt-1 text-green-600">
                {presentCount}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <p className="text-sm text-muted-foreground">Absent</p>
              <p className="text-3xl font-bold mt-1 text-red-500">
                {absentCount}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {batch.students.length}{" "}
            {batch.students.length === 1 ? "Student" : "Students"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {batch.students.length === 0 ? (
            <p className="text-muted-foreground">
              No students enrolled in this batch.
            </p>
          ) : (
            <AttendanceForm
              batchId={batchId}
              students={studentsWithId}
              selectedDate={selectedDate}
              existingAttendance={attendanceMap}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchAttendancePage;
