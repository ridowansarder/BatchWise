import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const AttendancePage = async () => {
  const { orgId, has, userId } = await auth();
  if (!orgId || !userId) notFound();

  const isAdmin = has({ role: "org:admin" });

  let teacherName = "";

  if (!isAdmin) {
    const teacher = await prisma.teacher.findFirst({
      where: { userId, orgId },
      select: { name: true },
    });

    if (!teacher) notFound();

    teacherName = teacher.name || "";
  }

  const batches = await prisma.batch.findMany({
    where: isAdmin
      ? { orgId }
      : { orgId, teacherName },
    orderBy: { createdAt: "desc" },
    include: { students: true },
  });

  return (
    <div className="py-6 px-6 sm:px-12 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Attendance</h1>
        <p className="text-muted-foreground mt-1">
          {isAdmin
            ? "Select batch to mark attendance"
            : "Select your batch to mark attendance"}
        </p>
      </div>

      {batches.length === 0 ? (
        <div className="text-center border-2 border-dashed px-4 py-12 rounded-lg">
          <p className="text-muted-foreground">
            {isAdmin
              ? "No batches found."
              : "No batches assigned to you yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {batches.map((batch) => (
            <Link key={batch.id} href={`/dashboard/attendance/${batch.id}`}>
              <Card className="hover:bg-muted/50 transition cursor-pointer">
                <CardContent className="p-4 text-center">
                  <p className="text-lg font-medium">{batch.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {batch.students.length} students
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendancePage;