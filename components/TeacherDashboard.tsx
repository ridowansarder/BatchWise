import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TeacherDashboardPage() {
  const { userId, orgId, has } = await auth();
  const user = await currentUser();

  if (!orgId || !userId || !user) notFound();
  if (!has({ role: "org:teacher" })) notFound();

  const fullName =
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Teacher";

  let teacher = await prisma.teacher.findFirst({
    where: {
      orgId,
      userId,
    },
  });

  if (!teacher) {
    teacher = await prisma.teacher.create({
      data: {
        orgId,
        userId,
        name: fullName,
        email: user.emailAddresses[0].emailAddress,
      },
    });
  }

  const batches = await prisma.batch.findMany({
    where: {
      teacherName: teacher.name || "",
      orgId,
    },
    include: {
      _count: {
        select: { students: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalBatches = batches.length;
  const totalStudents = batches.reduce(
    (acc, batch) => acc + batch._count.students,
    0,
  );

  return (
    <div className="py-6 px-12 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Welcome, {fullName}!</h1>
        <p className="text-muted-foreground">
          Overview of your assigned batches at your coaching center.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
              Total Batches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalBatches}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalStudents}</p>
          </CardContent>
        </Card>
      </div>

      {/* Batch List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Assigned Batches</CardTitle>
        </CardHeader>
        <CardContent>
          {batches.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No batches assigned yet.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  className="flex items-center justify-between border rounded-lg p-4 hover:border-primary/50 hover:bg-muted/20 transition-all"
                >
                  <div>
                    <p className="font-semibold text-lg">{batch.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {batch._count.students}{" "}
                      {batch._count.students === 1 ? "student" : "students"}{" "}
                      enrolled
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/batches/${batch.id}`}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                  >
                    Manage Batch
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
