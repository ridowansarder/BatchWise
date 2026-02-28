import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, School, CheckCircle2 } from "lucide-react";

export default async function AdminDashboard() {
  const { orgId } = await auth();
  if (!orgId) notFound();

  const [studentCount, teacherCount, batchCount, attendanceStats] = await Promise.all([
    prisma.student.count({ where: { orgId } }),
    prisma.teacher.count({ where: { orgId } }),
    prisma.batch.count({ where: { orgId } }),
    prisma.attendance.groupBy({
      by: ['status'],
      where: { orgId },
      _count: true,
    }),
  ]);

  // Calculate Average Attendance %
  const totalRecords = attendanceStats.reduce((acc, curr) => acc + curr._count, 0);
  const presentRecords = attendanceStats.find(a => a.status === "PRESENT")?._count || 0;
  const attendanceRate = totalRecords > 0 
    ? Math.round((presentRecords / totalRecords) * 100) 
    : 0;

  const stats = [
    {
      title: "Total Students",
      value: studentCount,
      icon: GraduationCap,
      description: "Enrolled across all batches",
    },
    {
      title: "Total Teachers",
      value: teacherCount,
      icon: Users,
      description: "Active instructors in org",
    },
    {
      title: "Active Batches",
      value: batchCount,
      icon: School,
      description: "Ongoing courses",
    },
    {
      title: "Attendance Rate",
      value: `${attendanceRate}%`,
      icon: CheckCircle2,
      description: "Overall present average",
    },
  ];

  return (
    <div className="py-6 px-12 space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-muted-foreground text-lg">
          Managing your coaching center&apos;s academic operations.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-sm border-muted-foreground/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}