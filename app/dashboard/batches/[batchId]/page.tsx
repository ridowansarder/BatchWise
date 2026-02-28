import { AddStudentModal } from "@/components/AddStudentModal";
import { UpdateBatchModal } from "@/components/UpdateBatchModal";
import { DeleteBatchModal } from "@/components/DeleteBatchModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Link from "next/link";

const BatchDetailsPage = async ({
  params,
}: {
  params: Promise<{ batchId: string }>;
}) => {
  const { orgId, has } = await auth();
  const { batchId } = await params;

  const batch = await prisma.batch.findUnique({
    where: { id: batchId, orgId: orgId || undefined },
    include: {
      students: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!batch) notFound();

  const isAdmin = has({ role: "org:admin" });

  const capacityFull =
    batch.capacity !== null && batch.students.length >= batch.capacity;

  return (
    <div className="py-6 px-12 space-y-8 w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{batch.name}</h1>
            {capacityFull && <Badge variant="destructive">Full</Badge>}
          </div>
          <p className="text-muted-foreground text-sm">
            Teacher:{" "}
            <span className="font-medium text-foreground">
              {batch.teacherName}
            </span>
          </p>
        </div>

        {isAdmin && (
          <div className="flex gap-2">
            {!capacityFull && <AddStudentModal batchId={batch.id} />}
            <UpdateBatchModal
              id={batch.id}
              batch={{
                name: batch.name,
                capacity: batch.capacity,
                teacherName: batch.teacherName,
              }}
            />
            <DeleteBatchModal batchId={batch.id} batchName={batch.name} />
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Enrolled</p>
            <p className="text-3xl font-bold mt-1">{batch.students.length}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {batch.students.length === 1 ? "student" : "students"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Capacity</p>
            <p className="text-3xl font-bold mt-1">{batch.capacity ?? "∞"}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {batch.capacity ? "max students" : "unlimited"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Slots Left</p>
            <p className="text-3xl font-bold mt-1">
              {batch.capacity
                ? Math.max(0, batch.capacity - batch.students.length)
                : "∞"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">remaining</p>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
        </CardHeader>
        <CardContent>
          {batch.students.length === 0 ? (
            <p className="text-muted-foreground">No students yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left border-b">
                  <tr>
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4 hidden sm:table-cell">Email</th>
                    <th className="py-2 pr-4 hidden md:table-cell">Phone</th>
                    <th className="py-2 pr-4 hidden md:table-cell">Gender</th>
                    <th className="py-2">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {batch.students.map((student) => (
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
                      <td className="py-2 pr-4 text-muted-foreground hidden sm:table-cell">
                        {student.email ?? "—"}
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground hidden md:table-cell">
                        {student.phone ?? "—"}
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground capitalize hidden md:table-cell">
                        {student.gender ? student.gender.toLowerCase() : "—"}
                      </td>
                      <td className="py-2 text-muted-foreground">
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
};

export default BatchDetailsPage;
