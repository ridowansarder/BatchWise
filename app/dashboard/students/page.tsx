import Link from "next/link";
import { StudentSearch } from "@/components/StudentSearch";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { orgId } = await auth();
  if (!orgId) notFound();

  const { search = "" } = await searchParams;

  const students = await prisma.student.findMany({
    where: {
      orgId,
      OR: [
        {
          firstName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
    include: {
      batch: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-6 px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Students</h1>
        <p className="text-muted-foreground">Manage and search students</p>

        
      </div>

      <StudentSearch />

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <p className="text-muted-foreground">No students found. Go to <Link href="/dashboard/batches" className="font-medium hover:underline">batches</Link> to add some.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left border-b">
                  <tr>
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4 hidden sm:table-cell">Batch</th>
                    <th className="py-2 pr-4 hidden sm:table-cell">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b hover:bg-muted/40 transition"
                    >
                      <td className="py-2 pr-4">
                        <Link
                          href={`/dashboard/students/${student.id}`}
                          className="font-medium hover:underline"
                        >
                          {student.firstName} {student.lastName}
                        </Link>
                      </td>
                      <td className="py-2 pr-4">{student.email ?? "—"}</td>
                      <td className="py-2 pr-4 hidden sm:table-cell">{student.batch?.name ?? "Not assigned"}</td>
                      <td className="py-2 pr-4 hidden sm:table-cell">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
