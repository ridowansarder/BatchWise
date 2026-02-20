import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const AttendanceHistoryPage = async ({
  params,
}: {
  params: { batchId: string };
}) => {
  const { orgId } = await auth();
  const { batchId } = await params;

  const batch = await prisma.batch.findUnique({
    where: { id: batchId, orgId: orgId || undefined },
    include: {
      students: {
        orderBy: { firstName: "asc" },
      },
    },
  });

  if (!batch) notFound();

  // Get last 30 days of attendance
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const attendanceRecords = await prisma.attendance.findMany({
    where: {
      batchId,
      orgId: orgId || undefined,
      date: {
        gte: thirtyDaysAgo,
      },
    },
    include: {
      student: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  // Group by date
  const attendanceByDate = attendanceRecords.reduce(
    (acc, record) => {
      const dateKey = record.date.toISOString().split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(record);
      return acc;
    },
    {} as Record<string, typeof attendanceRecords>,
  );

  // Calculate student-wise statistics
  const studentStats = batch.students.map((student) => {
    const studentAttendance = attendanceRecords.filter(
      (r) => r.studentId === student.id,
    );
    const total = studentAttendance.length;
    const present = studentAttendance.filter(
      (r) => r.status === "PRESENT",
    ).length;
    const absent = studentAttendance.filter(
      (r) => r.status === "ABSENT",
    ).length;
    const late = studentAttendance.filter((r) => r.status === "LATE").length;

    return {
      student,
      total,
      present,
      absent,
      late,
      percentage: total > 0 ? ((present / total) * 100).toFixed(1) : "0",
    };
  });

  return (
    <div className="py-6 px-12 space-y-5 w-full">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Attendance History</h1>
          <p className="text-muted-foreground mt-1">
            {batch.name} — Last 30 days
          </p>
        </div>
        <Link href={`/dashboard/batches/${batchId}/attendance`}>
          <Button>Mark Attendance</Button>
        </Link>
      </div>

      {/* Student Statistics */}
      <div>
        <h2 className="text-lg font-medium mb-4">Student Statistics</h2>
        <div className="grid gap-3">
          {studentStats.map((stat) => (
            <Card key={stat.student.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {stat.student.firstName} {stat.student.lastName}
                    </p>
                  </div>

                  <div className="flex gap-6 text-sm">
                    <div>
                      <p className="text-muted-foreground">Attendance</p>
                      <p className="font-semibold text-lg">
                        {stat.percentage}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Present</p>
                      <p className="font-semibold text-green-600">
                        {stat.present}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Absent</p>
                      <p className="font-semibold text-red-600">
                        {stat.absent}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Late</p>
                      <p className="font-semibold text-yellow-600">
                        {stat.late}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Daily Records */}
      <div>
        <h2 className="text-lg font-medium mb-4">Daily Records</h2>
        <div className="space-y-4">
          {Object.entries(attendanceByDate)
            .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
            .map(([date, records]) => {
              const present = records.filter(
                (r) => r.status === "PRESENT",
              ).length;
              const absent = records.filter(
                (r) => r.status === "ABSENT",
              ).length;
              const late = records.filter((r) => r.status === "LATE").length;

              return (
                <Card key={date}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <p className="text-muted-foreground">Present</p>
                        <p className="font-semibold text-green-600">
                          {present}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Absent</p>
                        <p className="font-semibold text-red-600">{absent}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Late</p>
                        <p className="font-semibold text-yellow-600">{late}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistoryPage;
